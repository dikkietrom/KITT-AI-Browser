const {ipcRenderer,contextBridge} = require('electron');

eval(ipcRenderer.sendSync('logPreload'))
const log = logPreload
log(' gpt4-api hack preload.js got logPreload')
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
console.log(mutations)

    mutations.forEach((mutation)=>{
      if (mutation.type === 'characterData') {


                ipcRenderer.send('gpt-hack-delta-text',{data:mutation.target.textContent})
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
    log('send-input  gpt4-api hack', message)
    window.fetch=null
    reset = true
    txtArea().value = message
    currentInput= message
    triggerEnterKeyOnTextarea()

}
)
ipcRenderer.on('get-last', (event,message)=>{
    let last = document.getElementsByClassName('group')
    last = last[last.length-1]
    last=last.innerText
    ipcRenderer.send('get-last' , last)
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


log('preload gpt4-api hack')



