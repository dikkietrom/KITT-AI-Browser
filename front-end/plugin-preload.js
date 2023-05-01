const {ipcRenderer,contextBridge} = require('electron');

eval(ipcRenderer.sendSync('logPreload'))
const log = logPreload
log('preload.js got logPreload')
console.log('test')

document.addEventListener('DOMContentLoaded', ()=>{

    log('pre load all DOMContentLoaded', location)
    observer.observe(document.body,config)

}
, false);

const config = {
    characterData: true,
    childList: true,
    subtree: true,
    characterDataOldValue: true,
    // This enables getting the old value
};

let reset = true
const observer = new MutationObserver((mutations)=>{
    mutations.forEach((mutation)=>{
      if (mutation.type === 'characterData') {
            log('got mutation : ' + mutation.target.textContent.substring(0,50) + ' ...')
            ipcRenderer.send('html-delta-text',{data:mutation.target.textContent})
      }
    }
    );
}
);

function txtArea() {
    return document.getElementsByTagName('textarea')[0]
}
let currentInput
ipcRenderer.on('send-input', (event,message)=>{
    log('send-input hack', message)
    reset = true
    txtArea().value = message
    currentInput = message
    triggerEnterKeyOnTextarea()

}
)
ipcRenderer.on('html-get-last', (event,message)=>{
    let last = document.getElementsByClassName('group')
    last = last[last.length-1]
    last= last.outerHTML
    log('html-get-last preload')
    ipcRenderer.send('html-get-last' , last)
 }
 )

 ipcRenderer.on('doInPreload', (event,json)=>{
     try {
        log('doInPreload' ,json.from)
        eval(json.js)
        ipcRenderer.send('doInPreload' , json)
     }catch(e){
        json.js=null
        json.error = e.message
        ipcRenderer.send('doInPreload' , json)
        err(e)
     }
  }
  )

function triggerEnterKeyOnTextarea() {
    try {
        const enterKeyEvent = new KeyboardEvent('keydown',{
            key: 'Enter',
            code: 'Enter',
            which: 13,
            keyCode: 13,
            bubbles: true,
            cancelable: true,
        });
        txtArea().dispatchEvent(enterKeyEvent);
    } catch (e) {
        err(e);
    }
}
