const {session, app, BrowserWindow, ipcMain, Menu, MenuItem, ipcRenderer, protocol} = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const packageJson = require(path.join(__dirname, '..', 'package.json'));
const {spawn} = require('child_process');

const url = require('url');
const {autoUpdater} = require('electron-updater');

const {Readable} = require('stream');
const {WritableStreamBuffer} = require('stream-buffers');

const {PassThrough} = require('stream');

const appName = packageJson.name;

const {log, err, initShared} = require(path.join(__dirname, '..', 'lib/shared.js'));
const filter = {
    urls: ['*://*/*'],
};
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
            useGL: false,
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
    mainWindow.webContents.openDevTools();

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

    mainWindow.webContents.on('devtools-closed', ()=>{
        log('devtools-closed')
        log.send('dev-tools-closed')
    }
    )

    try {
        autoUpdater.checkForUpdatesAndNotify();
    } catch (error) {
        err(error)
    }
    try {
        // Get the default menu
        const menu = Menu.getApplicationMenu();

        // Add a new item to the "File" menu
        let item = new MenuItem({
            id: 'update',
            label: 'update',
            click() {
                autoUpdater.checkForUpdatesAndNotify();
            }
        })
        item.menu = menu
        menu.append(item);

        // Set the updated menu to the application menu
        // Menu.setApplicationMenu(menu);
    } catch (error) {
        err(error)
    }

    //try init

    initMainScript('./ipcMain.js')

}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.name = 'KITT'

app.on('ready', createWindow);
app.on('web-contents-created', (event,contents)=>{
    log('web-contents-created')

    contents.on('will-attach-webview', (_wawevent,webPreferences,_params)=>{
        log('will-attach-webview')
        // console.log(webPreferences.partition)
        let partition = webPreferences.partition
        let ses = session.fromPartition(partition);
        //let ses = session.defaultSession
        // ses.setProxy({ proxyRules: 'http://localhost:8080' })

        //////////////// RESP

        // ses.webRequest.onHeadersReceived(filter, (details,callback)=>{
        //     try {
        //         let json = {}
        //        // console.log('onHeadersReceived', details)
        //         json.headers = details.responseHeaders
        //         json.url = details.url
        //         json.referrer = details.referrer
        //         json.partition = partition
        //         json.method = details.method
        //         json.eventType = 'onHeadersReceived'
        //         log.send('onHeadersReceived', json)
        //         if(callback)callback({
        //             cancel: false
        //         })
        //     } catch (error) {
        //         err(error)
        //     }
        // }
        // );
        // ses.webRequest.onResponseStarted(filter, (details,callback)=>{
        //     try {
        //         let json = {}
        //        // console.log('onResponseStarted', details)
        //         json.headers = details.responseHeaders
        //         json.url = details.url
        //         json.referrer = details.referrer
        //           json.method = details.method
        //       json.partition = partition
        //         json.eventType = 'onResponseStarted'
        //         log.send('onHeadersReceived', json)
        //         if(callback)callback({
        //             cancel: false
        //         })
        //     } catch (error) {
        //         err(error)
        //     }
        // }
        // );
        // ses.webRequest.onCompleted(filter, (details,callback)=>{
        //     try {
        //        // console.log('onCompleted', details)
        //         let json = {}
        //         json.headers = details.responseHeaders
        //         json.url = details.url
        //         json.referrer = details.referrer
        //           json.method = details.method
        //       json.partition = partition
        //         json.eventType = 'onCompleted'
        //         log.send('onHeadersReceived', json)
        //         if(callback)callback({
        //             cancel: false
        //         })
        //     } catch (error) {
        //         err(error)
        //     }
        // }
        // );
        //////////////// REQ
        // ses.webRequest.onBeforeRequest(filter, (details,callback)=>{

        //     try {
        //        // console.log('onBeforeRequest', details)

        //         const buffer = details.uploadData && details.uploadData.length ? Array.from(details.uploadData)[0].bytes.toString() : ''

        //         let json = {}
        //         json.headers = details.requestHeaders
        //         json.buffer = buffer.split('\n')
        //         json.url = details.url
        //             json.method = details.method
        //     json.referrer = details.referrer
        //         json.partition = partition
        //         json.eventType = 'onBeforeRequest'
        //         log.send('onBeforeRequest', json)
        //         if(callback)callback({
        //             cancel: false
        //         })
        //     } catch (error) {
        //         err(error)
        //     }
        // }
        // )
        console.log('onBeforeSendHeaders attach')

        ses.webRequest.onBeforeSendHeaders(filter, (details,callback)=>{

            try {
                

                const buffer = details.uploadData && details.uploadData.length ? Array.from(details.uploadData)[0].bytes.toString() : ''
                 console.log('onBeforeSendHeaders', buffer)
                let json = {}
                json.headers = details.requestHeaders
                json.buffer = buffer.split('\n')
                json.method = details.method
                json.url = details.url
                json.referrer = details.referrer
                json.eventType = 'onBeforeSendHeaders'
                json.partition = partition
                log.send('onBeforeRequest', json)
                if (callback)
                    callback({
                        cancel: false
                    })
            } catch (error) {
                err(error)
            }
        }
        )
        // ses.webRequest.onSendHeaders(filter, (details,callback)=>{

        //     try {
        //        // console.log('onSendHeaders', details)

        //         const buffer = details.uploadData && details.uploadData.length ? Array.from(details.uploadData)[0].bytes.toString() : ''

        //         let json = {}
        //         json.headers = details.requestHeaders
        //         json.buffer = buffer.split('\n')
        //         json.url = details.url
        //         json.method = details.method
        //         json.referrer = details.referrer
        //         json.partition = partition
        //         json.eventType = 'onSendHeaders'
        //         log.send('onBeforeRequest', json)
        //         if(callback) callback({
        //             cancel: false
        //         })
        //     } catch (error) {
        //         err(error)
        //     }
        // }
        // )

    }
    )
}
)

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
