const {ipcRenderer} = require('electron');

eval(ipcRenderer.sendSync('logPreload'))
const log = logPreload
log('google preload.js got logPreload')
console.log('google')
document.addEventListener('DOMContentLoaded', ()=>{

    log('pre load all DOMContentLoaded',location)
    ipcRenderer.send('send-input-google-return', document.body.innerText)
}, false);


ipcRenderer.on('send-input-google', (event,message)=>{
    log('send-input google', message)
    location.href = 'https://www.google.com/search?q='+message

}
)


log('preload Google-api hack')