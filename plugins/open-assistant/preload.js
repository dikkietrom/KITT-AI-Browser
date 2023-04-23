const {ipcRenderer} = require('electron');

eval(ipcRenderer.sendSync('logPreload'))
const log = logPreload
log('Open Ass preload.js got logPreload')
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
          ipcRenderer.send('oa-delta-text',{data:mutation.target.textContent})
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
    log('send-input Open Ass', message)
    window.fetch=null
    reset = true
    txtArea().value = message
    currentInput= message

    triggerEnterKeyOnTextarea()

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

log('preload Open Ass-api hack')
