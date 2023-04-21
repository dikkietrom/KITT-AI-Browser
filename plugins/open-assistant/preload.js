const {ipcRenderer} = require('electron');

eval(ipcRenderer.sendSync('logPreload'))
const log = logPreload
log('Open Ass preload.js got logPreload')
console.log()
document.addEventListener('DOMContentLoaded', ()=>{

    log('pre load all DOMContentLoaded',location)
    ipcRenderer.send('send-input-Open Ass-return', document.body.innerText)
 
}, false);

function txtArea() {
    return document.getElementsByTagName('textarea')[0]
} 

ipcRenderer.on('send-input-Open Ass', (event,message)=>{
    log('send-input Open Ass', message)
    //location.href = 'https://www.google.com/search?q='+message

}
)


log('preload Open Ass-api hack')