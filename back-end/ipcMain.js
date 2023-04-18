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

    //    chromeMainDebug = spawn('open', ['-a', 'Google Chrome', 'chrome://inspect']);
    //      chromeMainDebug.on('exit', (code) => {
    //            // spawn('killall', ['Google Chrome']);
    //          log(code)
    //
    //      });
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

//initialize plugins by getting the files from the plugins folder
async function initPlugins() {

    const pluginPath = path.join(__dirname, '../plugins');

    let sortedDirs = fs.readdirSync(pluginPath)
    log('initPlugins sortedDirs before sort', sortedDirs);

    sortedDirs = sortedDirs.sort((a,b)=>a.localeCompare(b));
    log('initPlugins sortedFiles after sort', sortedDirs);

    for (let i = 0; i < sortedDirs.length; i++) {
        const dir = sortedDirs[i];
        if (dir == '.DS_Store') {
            continue
        }
        log('initPlugins', dir);
        try {

            // Path to check
            const file = path.join(pluginPath, dir, 'main.js')

            // Check if path exists
            if (fs.existsSync(file)) { 
                const plugin = require(file); 
                await plugin(log); 
            } else{
                log('[INFO] : ' + file + ' does not exist')
            }
            

        } catch (error) {
            err(error)
        }
    }

    log.send('plugin-message', sortedDirs);

}

module.exports = init
