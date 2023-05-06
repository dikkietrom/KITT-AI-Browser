const {ipcMain,webContents} = require('electron')
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

 
 
ipcMain.on('attach-debugger', (event, webContentsId) => {
    const webviewWebContents = webContents.fromId(webContentsId);
    

    webviewWebContents.closeDevTools();


    // you can add event listeners to webviewWebContents here
    // for example, to listen to network events
    webviewWebContents.debugger.on('detach', () => {
        log('Debugger detached');
    });

    webviewWebContents.debugger.on('message', (event, method, params) => {
      //  if (method === 'Network.responseReceived') {
            console.log('Response received:', params);
      //  }
    });

    webviewWebContents.debugger.attach('1.0');
    webviewWebContents.debugger.sendCommand('Network.enable');
});

 

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
        const all = require(json.imp)
        log(json)
        let returnValue = all[json.func](json)
        log(returnValue)
        event.returnValue = returnValue
    } catch (error) {
        err(error)
        event.returnValue = error.stack + '\n' + json
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
        json[dir] = {}
        let dirInfo = json[dir]
        log('initPlugins', dir);
        try {

            // Path to check
            let file = path.join(pluginPath, dir, 'main.js')

            // Check if path exists, init file
            if (fs.existsSync(file)) {
                const pluginInit = require(file);

                if (typeof pluginInit === 'function') {
                    // If pluginInit is a function, call it directly
                    await pluginInit(log);
                } else if (typeof pluginInit === 'object' && !Array.isArray(pluginInit) && typeof pluginInit.init === 'function') {
                    // If pluginInit is an object and has an 'init' function, call it
                    await pluginInit.init(log);
                } else {
                    // Handle the case where there is no appropriate function to call
                    log('The module does not export a valid function or init method.');
                }
            } else {
                log('[INFO] : ' + file + ' does not exist')
            }

            // Path to check
            file = path.join(pluginPath, dir, 'preload.js')

            // Check if path exists, init file
            if (fs.existsSync(file)) {
                dirInfo.preload = true
            } else {
                log('[INFO] : ' + file + ' does not exist')
            }

        } catch (error) {
            err(error)
        }
    }

    log.send('plugin-message', json);

}

module.exports = init
