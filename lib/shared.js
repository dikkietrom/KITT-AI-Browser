


function extractLine(str, depth) {
    let line = str.split('\n')[depth + 1].trim()
    let parts = line.split(' ')
    let last = parts.pop()

    last = last.substring(last.indexOf('/KITT/') + 6)
    last = last.substring(0, last.lastIndexOf(':'))
    let ret = [last, parts.join(' '), ':'].join(' ')
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
            let line = error.stack.split('\n')[2].trim()
            let first = line.substring(line.lastIndexOf(')') + 1)
            if(!first){
                first = line.substring(0,line.indexOf('(') )
            }
            args.unshift(first)
            args.unshift("[PRELOAD] " + location.href + " :")

        }
        console.log(args.join(' '))

        ipcRenderer.send('preload-log', args);
    } catch (error) {
        err( error);
    }

}

function err() {

    log(arguments)

}
let webContents = null

function init(w) {
    webContents = w
    log('init shared')
   
    const {ipcMain} = require('electron')

    ipcMain.on('logPreload', (event)=>{

        event.returnValue = [
            logPreload.toString(), 
            err.toString(), 
            logInfo.toString(), 
            extractLine.toString(), ].join('\n')
    }
    )
}
function log() {

    if (webContents) {

        try {
            
            const args = Array.from(arguments).map(arg=>{
                if (arg[0] && arg[0] instanceof Error) {
                    console.error(arg[0])
                    return arg[0]
                }
                return String(arg)
            }
            );
            args.unshift(logInfo(2))

            console.log(args.join(' '))

            webContents.send('main-log', args);

         
             


        } catch (error) {
            console.error('main log error in logging to front : ', arguments, error);
        }
    } else {
        console.log('main log no web window yet : ' + Array.from(arguments).map(arg=>String(arg)))
    }
}


Array.prototype.insert = function(index, ...elements) {
  this.splice(index, 0, ...elements);
};

try {
    exports.logInfo = logInfo;
    exports.logPreload = logPreload;
    exports.err = err;
    exports.log = log;
    exports.initShared = init;

} catch (e) {
    if (e.message.indexOf("ReferenceError: exports is not defined") == 0) {

        err(e)
    }
}
