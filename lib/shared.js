const {ipcMain} = require('electron');

ipcMain.on('logPreload', (event)=>{

    event.returnValue = [
        logPreload.toString() ,
        err.toString(),
        logInfo.toString(),
        extractLine.toString(),
    ].join('\n')
}
)

function extractLine(str, depth) {
    let line = str.split('\n')[depth+1].trim()
    let parts = line.split(' ')
    let last = parts.pop()

      
    last=last.substring(last.indexOf('/KITT/')+6)
    last=last.substring(0,last.lastIndexOf(':'))
    let ret = [last,parts.join(' '),':'].join(' ')
    return ret
    

}
 
 
function logInfo(depth) {
    try {
        throw new Error()
    } catch (info) {
        return extractLine(info.stack, depth)

    }
}

function logPreload() {

        try {
            const args = Array.from(arguments).map(arg=>String(arg));
            try {
               throw new Error()
            } catch (error) {
                let line = error.stack.split('\n')[1].trim()
                args.unshift( line.substring(line.lastIndexOf(')')+1))
                args.unshift( "[PRELOAD] "+ location.host +" :" )

            }
            console.log(args.join(' '))

            ipcRenderer.send('preload-log', args);
        } catch (error) {
            console.error('preload log error in logging to front : ', arguments, error);
        }


}

function err() {
    console.error(arguments)
    log(arguments)
}
let webContents = null
function init(w){
    webContents = w
    log('init')
}
function log() {

    if (webContents) {

        try {
            const args = Array.from(arguments).map(arg=>String(arg));
            args.unshift( logInfo(2))

            console.log(args.join(' '))

            webContents.send('main-log', args);
        } catch (error) {
            console.error('main log error in logging to front : ', arguments, error);
        }
    }
    else{
        console.log('main log no web window yet : ' + Array.from(arguments).map(arg=>String(arg)))
    }
}

try {
    exports.logInfo = logInfo;
    exports.logPreload = logPreload;
    exports.err = err;
    exports.log = log;
    exports.initShared = init;

} catch (e) {
    if (e.message.indexOf("ReferenceError: exports is not defined") == 0) {

        log(e)
    }
}
