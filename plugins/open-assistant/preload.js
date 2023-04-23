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
               const oldValue = mutation.oldValue;
               const newValue = mutation.target.textContent;


               if(oldValue=='Untitled' && newValue == currentInput){
                    return
               }
               console.log('oldValue',oldValue)
               console.log('newValue',newValue)

              // log('Delta text:','\'' ,oldValue,'\'',' -> \'',newValue,'\'');

               // Calculate the delta text
               let deltaText = ''
                 let trim = oldValue.trim()
                if (reset ) {
                    console.log('reset on delta',reset)
                   deltaText = newValue
                   reset = false
                  // log('new value:','\'' ,oldValue,'\'',' -> \'',newValue,'\'');

                }else if (newValue.length > oldValue.length) {
                    console.log('else reset on delta',reset)

                   deltaText = newValue.substring(oldValue.length);
                }
                console.log('deltaText',deltaText)

                ipcRenderer.send('oa-delta-text',{data:deltaText,target:mutation.target.className})
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
