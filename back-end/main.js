const {session,app, BrowserWindow, ipcMain, Menu, MenuItem, ipcRenderer} = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const packageJson = require(path.join(__dirname, '..', 'package.json'));
const {spawn} = require('child_process');

const url = require('url');
const {autoUpdater} = require('electron-updater');

const {Readable} = require('stream');
const {WritableStreamBuffer} = require('stream-buffers');

const appName = packageJson.name;

const {log,err,initShared} = require(path.join(__dirname, '..','lib/shared.js'));
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
    initShared(mainWindow.webContents)
    log.send = (name,message)=>{
        mainWindow.webContents.send(name, message)
    }
    const filter = {
        urls: ['*://*/*'],
    };

    mainWindow.webContents.on('devtools-closed', ()=>{
        log('devtools-closed')
        log.send('dev-tools-closed')
    }
    )

    session.defaultSession.webRequest
        .onBeforeSendHeaders(filter, (details,callback)=>{
        
        if (details.uploadData) {
            try {

                const buffer = details.uploadData.length ?  Array.from(details.uploadData)[0].bytes.toString() : ''
                let obj = {}
                obj.requestHeaders=details.requestHeaders
                obj.buffer = buffer.split('\n')
                obj.url = details.referrer
                log.send('onBeforeSendHeaders', obj)

            } catch (error) {
                err(error)
            }
        }
        if (callback) {
            callback(details);
        }
    }
    )

}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.name = 'KITT'

app.on('ready', createWindow);
app.on('web-contents-created', (event,contents)=>{
    log('web-contents-created')
    contents.on('will-attach-webview', (_wawevent,webPreferences,_params)=>{

        //log('will-attach-webview', _wawevent, webPreferences, _params)

    }
    )
}
)
// Wait for the app to be ready
app.whenReady().then(()=>{
    try {
        autoUpdater.checkForUpdatesAndNotify();
    } catch (error) {
        err(error)
    }
    try {
        // Get the default menu
        const menu = Menu.getApplicationMenu();

        // Add a new item to the "File" menu
        menu.insert(0, new MenuItem({
            label: 'Update',
            click() {
                autoUpdater.checkForUpdatesAndNotify();
            }
        }));

        // Set the updated menu to the application menu
        Menu.setApplicationMenu(menu);
    } catch (error) {
        err(error)
    }

    //try init
    initMainScript('../stt/stt-main.js')
    initMainScript('../tts/tts-main.js')
    initMainScript('./bash.js')
    initMainScript('./ipcMain.js')

}
);

function initMainScript(script) {
    //try init plugins
    try {
        log('try ', script)

        const func = require(path.join(__dirname, script));
        func(log);
    } catch (error) {
        err(error)
    }
}

process.on('SIGINT', ()=>{
    log('Received SIGINT signal.');
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


