const {ipcRenderer} = require('electron');

eval(ipcRenderer.sendSync('logPreload'))
const log = logPreload
log('youtube preload.js got logPreload')
console.log('youtube')
document.addEventListener('DOMContentLoaded', ()=>{

    log('pre load all DOMContentLoaded',location)
    ipcRenderer.send('send-input-youtube-return', document.body.innerText)
}, false);


ipcRenderer.on('send-input', (event,message)=>{
    log('send-input youtube', message)
    location.href = 'https://www.youtube.com/results?search_query='+message

}
)


log('preload Youtube-api hack')