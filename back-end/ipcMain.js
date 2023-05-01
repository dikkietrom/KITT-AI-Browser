const {ipcMain} = require('electron')
const robot = require('robotjs');
const path = require('path');
const fs = require('fs');
const {spawn, exec} = require('child_process');
const {err} = require(path.join(__dirname, '..', 'lib/shared.js'));

function init(lg) {
    log = lg

    log('ipcMain init')
}
//on document loaded
ipcMain.on('plugin-request', (event,arg)=>{
    log('plugin-request')
    initPlugins()
}
)

ipcMain.on('debug', ()=>{
    log.webContents.openDevTools();

}
)
ipcMain.on('debug-stop', ()=>{
    log.webContents.closeDevTools();

}
)

ipcMain.on('debug-main', ()=>{

    let process = exec('open -a "Google Chrome" chrome://inspect', (error,stdout,stderr)=>{
        if (error) {
            err(`Error executing command: ${error}`);
            return;
        }

    }
    );
    process.on('close', (code)=>{
        log(`child close exited with code ${code}`);
        //process.kill()
        // spawn('killall', ['Google Chrome']);

    }
    );
    process.on('exit', (code)=>{
        log(`chrome inspect exit exited with code ${code}`);
        //process.kill()
        // spawn('killall', ['Google Chrome']);

    }
    );
}
)

ipcMain.on('debug-main-stop', ()=>{
    spawn('killall', ['Google Chrome']);
}
)

ipcMain.on('preload-log', (event,mes)=>{
    console.log(mes.join(' '))
    log.send('preload-log', mes)
}
);

ipcMain.on('doInPreload', (event,json)=>{
    let key = `doInPreload-${json.from}`
    console.log(key)
    log.send(key, json)
}
);
ipcMain.on('doInMain', (event,json)=>{
    try {
        console.log('doInMain', json)
        eval (json.js)
    } catch (error) {
        err(error)
    }
}
);

//initialize plugins by getting the files from the plugins folder
async function initPlugins() {

    const pluginPath = path.join(__dirname, '../plugins');

    let sortedDirs = fs.readdirSync(pluginPath)
    log('initPlugins sortedDirs before sort', sortedDirs);

    sortedDirs = sortedDirs.sort((a,b)=>a.localeCompare(b));
    let json = {}
    log('initPlugins sortedFiles after sort', sortedDirs);

    for (let i = 0; i < sortedDirs.length; i++) {
        const dir = sortedDirs[i];
        if (dir == '.DS_Store') {
            continue
        }
        json[dir]={}
        let dirInfo = json[dir]
        log('initPlugins', dir);
        try {

            // Path to check
            let file = path.join(pluginPath, dir, 'main.js')

            // Check if path exists, init file
            if (fs.existsSync(file)) {
                const pluginInit = require(file);
                await pluginInit(log);
            } else {
                log('[INFO] : ' + file + ' does not exist')
            }

            // Path to check
            file = path.join(pluginPath, dir, 'preload.js')

            // Check if path exists, init file
            if (fs.existsSync(file)) {
                dirInfo.preload=true
            } else {
                log('[INFO] : ' + file + ' does not exist')
            }

        } catch (error) {
            err(error)
        }
    }

    log.send('plugin-message',json );

}

module.exports = init
