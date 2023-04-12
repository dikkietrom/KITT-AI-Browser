const {app, BrowserWindow, ipcMain, Menu,MenuItem, ipcRenderer} = require('electron');
const fs = require('fs');
const isDev = require('electron-is-dev');
const path = require('path');
const packageJson = require(path.join(__dirname, '..', 'package.json'));
const {spawn, exec} = require('child_process');
const applescript = require('applescript');

const url = require('url');
const {autoUpdater} = require('electron-updater');

const {Readable} = require('stream');
const {WritableStreamBuffer} = require('stream-buffers');

const appName = packageJson.name;
const {session} = require('electron');





autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'dikkietrom',
    repo: 'KITT',
    // Optional: set the prerelease flag to true to use prerelease versions
    prerelease: false
});

// Set the updated menu to the application menu
// Add this line to enable electron-reload
if (isDev) {//    require('electron-reload')(__dirname, {
//        electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
//        hardResetMethod: 'exit',
//    });
}

function createWindow() {
    // Create the browser window
    let mainWindow = new BrowserWindow({
        width: 2000,
        height: 1000,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: false,
            enableRemoteModule: false,
            webviewTag: true,
            preload: path.join(__dirname, '../front-end/preload.js'),
        },
    });

    // Load your HTML file
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../front-end/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Open the DevTools if needed
    //mainWindow.webContents.openDevTools();

    // Handle window close event
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
    createWindow.mainWindow = mainWindow
    log.webContents = mainWindow.webContents
    log.send =  (name,message) => { mainWindow.webContents.send(name,message) }
    const filter = {
        urls: ['*://*/*'],
    };

    mainWindow.webContents.on('devtools-closed', ()=>{
        console.log('devtools-closed', log)
        log.send('dev-tools-closed')
    }
    )

    session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details,callback)=>{
        //console.log('onBeforeSendHeaders', details)
        if (details.uploadData) {
            try {
               
                const buffer = Array.from(details.uploadData)[0].bytes.toString();
                let obj = {}
                obj.buffer=buffer
                obj.url=details.referrer
                log.send('onBeforeSendHeaders', obj)

            } catch (error) {
                console.log(error)
            }
        }
        if(callback){
            callback(details);
        }
    }
    )


}
//initialize plugins by getting the files from the plugins folder
function initPlugins(){

    const pluginPath = path.join(__dirname, '../plugins');

    const sortedFiles = fs.readdirSync(pluginPath).sort((a, b) => a.localeCompare(b));

    sortedFiles.forEach(file => {
          console.log('initPlugins', file);

          log.send('plugin-message', file);
          const plugin = require(path.join(pluginPath, file, 'main.js'));
          plugin(log);
    });


}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.name = 'KITT'

app.on('ready', createWindow);

// Wait for the app to be ready
app.whenReady().then(()=>{
    try {
        autoUpdater.checkForUpdatesAndNotify();
    } catch (error) {
        console.log(error)
    }
    try {
        // Get the default menu
        const menu = Menu.getApplicationMenu();

        // Add a new item to the "File" menu
        menu.insert(0, new MenuItem({
            label: 'New Menu Item',
            click() {
                console.log('New menu item clicked');
            }
        }));

        // Set the updated menu to the application menu
        Menu.setApplicationMenu(menu);
    } catch (error) {
        console.log(error)
    }
    //try init stt
    try {
        const stt = require(path.join(__dirname, '../stt/stt-main.js'));
        stt(log);
    }catch (error) {
        console.log(error)
    }
    //try init tts
    try {
        const tts = require(path.join(__dirname, '../tts/tts-main.js'));
        tts(log);

    }catch (error) {
        console.log(error)
    }

}
);
process.on('SIGINT', ()=>{
    console.log('Received SIGINT signal.');
    spawn('killall', ['Google Chrome']);
    // Quit the app
    app.quit();
}
);
// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // if (process.platform !== 'darwin') {
    app.quit();
    // }
});

app.on('before-quit', function(event) {
    spawn('killall', ['Google Chrome']);

})
app.on('quit', function(event) {
    spawn('killall', ['Google Chrome']);

})
app.on('will-quit', function(event) {
    spawn('killall', ['Google Chrome']);

})

app.on('activate', function() {
    if (createWindow.mainWindow === null) {
        createWindow();
    }
});

//on document loaded
ipcMain.on('plugin-request', (event, arg) => {
    console.log('plugin-request', arg)
    initPlugins()
})

app.on('web-contents-created', (event,contents)=>{
    console.log('web-contents-created')
    contents.on('will-attach-webview', (_wawevent,webPreferences,_params)=>{

        console.log('will-attach-webview', _wawevent,webPreferences,_params)

    }
    )
}
)
ipcMain.on('debug', ()=>{
    createWindow.mainWindow.webContents.openDevTools();

}
)
ipcMain.on('debug-stop', ()=>{
    createWindow.mainWindow.webContents.closeDevTools();

}
)

let chromeMainDebug
ipcMain.on('debug-main', ()=>{

//    chromeMainDebug = spawn('open', ['-a', 'Google Chrome', 'chrome://inspect']);
//      chromeMainDebug.on('exit', (code) => {
//            // spawn('killall', ['Google Chrome']);
//          console.log(code)
//
//      });
    let process = exec('open -a "Google Chrome" chrome://inspect', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error}`);
        return;
      }

    });
    process.on('close', (code) => {
        console.log(`child close exited with code ${code}`);
          //process.kill()
         // spawn('killall', ['Google Chrome']);

    });
     process.on('exit', (code) => {
       console.log(`chrome inspect exit exited with code ${code}`);
         //process.kill()
        // spawn('killall', ['Google Chrome']);

     });
}
)
ipcMain.on('debug-main-stop', ()=>{
    spawn('killall', ['Google Chrome']);
}
)

function log(msg) {
    //console.log(msg);
    createWindow.mainWindow.webContents.send('main-log', msg);
}
