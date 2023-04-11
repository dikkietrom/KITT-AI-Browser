const isDev = require('electron-is-dev');
const path = require('path');
const {app, BrowserWindow, ipcMain, Menu, ipcRenderer} = require('electron');
const url = require('url');

const {exec} = require('child_process');

const {Readable} = require('stream');
const {WritableStreamBuffer} = require('stream-buffers');

const appName = require('./package.json').name;
const {session} = require('electron');

const stt = require('./stt-main');
stt(log)
const tts = require('./tts-main');
tts(log)

const gpt = require('./gpt-main');
gpt(log)
const dalle = require('./dall-e-main');
dalle(log)

const gpt4apiHack = require('./gpt4-api-hack-main');
gpt4apiHack(log)
const gptEdit = require('./gpt-edit-main');
gptEdit(log)

const mjApiHack = require('./mj-api-hack-main.js');
mjApiHack(log)



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
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    // Load your HTML file
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
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
    log.send = mainWindow.webContents.send
    const filter = {
        urls: ['*://*/*'],
    };

    session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details,callback)=>{
        if (details.uploadData) {
            try {
                const buffer = Array.from(details.uploadData)[0].bytes.toString();

                if (details.referrer.indexOf('https://chat.openai.com/chat') == 0) {
                    log.webContents.send('chat-gpt4-api-hack-reply', buffer)

                }
            } catch (error) {
                console.log(error)
            }

        }
        callback(details);
    }
    )

}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // if (process.platform !== 'darwin') {
    app.quit();
    // }
});

app.on('activate', function() {
    if (createWindow.mainWindow === null) {
        createWindow();
    }
});
app.on('web-contents-created', (event,contents)=>{
    console.log('web-contents-created')

    contents.on('will-attach-webview', (_wawevent,webPreferences,_params)=>{

        console.log('will-attach-webview', _params.src)

        if (_params.src === 'https://chat.openai.com/') {
            let file = path.join(__dirname, 'preload-gpt4-api-hack.js')
            console.log(file)
            webPreferences.preload = file;
        } else if (_params.src === 'https://chat.d-id.com/') {
            let file = path.join(__dirname, 'preload-did-api-hack.js')
            console.log(file)
            webPreferences.preload = file;
        } else if (_params.src.indexOf('https://discord.com/channels/@me') == 0) {
            let file = path.join(__dirname, 'preload-mj-api-hack.js')
            console.log(file)
            webPreferences.preload = file;
        }
    }
    )
}
)
app.name = 'KITT'
function log(msg) {
    //console.log(msg);
    createWindow.mainWindow.webContents.send('main-log', msg);
}
