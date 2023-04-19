// preload.js
const {contextBridge,ipcRenderer} = require('electron');

eval(ipcRenderer.sendSync('logPreload'))
const log = logPreload
log('google preload.js got logPreload')
function txtArea() {
    return document.getElementsByTagName('textarea')[0]
}
document.addEventListener('DOMContentLoaded', ()=>{
    // initMutationObserver()
    //  log(document.body.innerText)
    log('pre load all DOMContentLoaded',location)
    if (location.toString().indexOf('q=init') == -1) {
        ipcRenderer.send('send-input-google-return', document.body.innerText)
    }
}
, false);

 

ipcRenderer.on('send-input-google', (event,message)=>{
    log('send-input google', message)
    txtArea().value = message.content

    //  const targetNode = document.getElementsByTagName('main')[0]
    // observer.observe(targetNode, config)
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

        // setTimeout(()=>{
        // txtArea().dispatchEvent(enterKeyEvent);
        const clickEvent = new MouseEvent('click',{
            bubbles: true,
            // Ensure the event bubbles up through the DOM
            cancelable: true,
            // Allow the event to be canceled
            view: window,
            // Set the view property to the current window
            detail: 1 // Set the click count (single click)
        });

        // Dispatch the click event on the button

        document.getElementsByTagName('button')[0].dispatchEvent(clickEvent);
        // }   ,500)

        // setTimeout(eval(`
        //     try {
        //         log('send-input-google-return',document.body.innerText)
        //         //ipcRenderer.send('send-input-all-return',document.body.innerText)
        //     } catch(e) {
        //       err(e);
        //     }`),2000)

    } catch (e) {
        err(e);
    }
}
let observer

const config = {
    characterData: true,
    //childList:true,
    subtree: true,
    characterDataOldValue: true,
    // This enables getting the old value
};

function initMutationObserver() {
    try {

        observer = new MutationObserver((mutationsList,observer)=>{
            for (const mutation of mutationsList) {

                // log('MutationObserver:', mutation);

                if (mutation.type === 'characterData') {
                    const oldValue = mutation.oldValue;
                    const newValue = mutation.target.textContent;
                    // log('Delta text:','\'' ,oldValue,'\'',' -> \'',newValue,'\'');

                    // Calculate the delta text
                    let deltaText = '';
                    let trim = oldValue.trim()
                    if (!trim.length || trim.length == 1 && trim.charCodeAt(0) == 8203) {
                        deltaText = newValue
                        // log('new value:','\'' ,oldValue,'\'',' -> \'',newValue,'\'');

                    } else if (newValue.length > oldValue.length) {

                        deltaText = newValue.substring(oldValue.length);
                        //  log('new value > ','\'' ,oldValue,'\'',' -> \'',newValue,'\'');
                    }

                    //        if(deltaText){
                    //            log('Delta text:', deltaText);
                    //            ipcRenderer.send('tts',deltaText)
                    //        }

                }

                //  if (mutation.type === 'childList') {
                //    //for(var i = 0; i < mutation.addedNodes.length; i++){
                //        // // Get the added nodes
                //         const addedNodes = Array.from(mutation.addedNodes);
                //    //  let node = mutation.addedNodes[i]

                //        // // Get the outerHTML of the added nodes
                //        const deltaHTML = addedNodes.map(node => node.outerHTML).join('');

                //         log('Delta HTML:', deltaHTML);
                //          //if (hasTextContent(node)) {
                //              ipcRenderer.send('plugin-gpt4-api-hack',deltaHTML)

                //          //}
                //    //}
                // }
            }
        }
        );

    } catch (e) {
        // statements
        err(e);
    }
}
function hasTextContent(element) {
    if (!element || !element.childNodes) {
        return false;
    }

    for (const childNode of element.childNodes) {
        if (childNode.nodeType === Node.TEXT_NODE && childNode.textContent.trim() !== '') {
            return true;
        }
    }

    return false;
}

log('preload Google-api hack')
