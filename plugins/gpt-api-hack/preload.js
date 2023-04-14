// preload.js
const { ipcRenderer,session } = require('electron');


function txtArea(){
  return document.getElementsByTagName('textarea')[0]
}
document.addEventListener(
    'DOMContentLoaded',
    () => {
     // initMutationObserver()

    },
    false
);
 ipcRenderer.on('send-input', (event,arg) => {
    log('send-input',arg)
    txtArea().value=arg
        
  //  const targetNode = document.getElementsByTagName('main')[0]
   // observer.observe(targetNode, config)
    triggerEnterKeyOnTextarea()


})


 function triggerEnterKeyOnTextarea() {
  try {
    const enterKeyEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      which: 13,
      keyCode: 13,
      bubbles: true,
      cancelable: true,
    });
    txtArea().dispatchEvent(enterKeyEvent);
  } catch(e) {
    err('Textarea not found',e);
  }
}
let observer 

const config = {
  characterData: true,
  //childList:true,
  subtree: true,
  characterDataOldValue: true, // This enables getting the old value
};

function initMutationObserver() {
  try {
    
   observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {

       // log('MutationObserver:', mutation);

      if (mutation.type === 'characterData') {
        const oldValue = mutation.oldValue;
        const newValue = mutation.target.textContent;
       // log('Delta text:','\'' ,oldValue,'\'',' -> \'',newValue,'\'');

        // Calculate the delta text
        let deltaText = '';
          let trim = oldValue.trim()  
         if (!trim.length || trim.length == 1 && trim.charCodeAt(0) == 8203 ) {
            deltaText = newValue
           // log('new value:','\'' ,oldValue,'\'',' -> \'',newValue,'\'');

         }else if (newValue.length > oldValue.length) {

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
  });

 
  } catch(e) {
    // statements
    log(e);
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

log('preload gpt4-api hack')

