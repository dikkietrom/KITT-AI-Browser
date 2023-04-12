// preload.js
const { ipcRenderer,session } = require('electron');


function txtArea(){
  return document.getElementsByTagName('textarea')[0]
}
let loads=0
document.addEventListener(
    'DOMContentLoaded',
    () => {
     // initMutationObserver()
     console.log('pre load all DOMContentLoaded')
     if(loads>0) {
        ipcRenderer.send('send-input-all-return',document.body.innerText)
     }
     loads++


    },
    false
);
 ipcRenderer.on('send-input-all', (event,arg) => {
    console.log('send-input-all',arg)
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

   // setTimeout(()=>{
       // txtArea().dispatchEvent(enterKeyEvent);
           const clickEvent = new MouseEvent('click', {
             bubbles: true,       // Ensure the event bubbles up through the DOM
             cancelable: true,    // Allow the event to be canceled
             view: window,        // Set the view property to the current window
             detail: 1            // Set the click count (single click)
           });


       // Dispatch the click event on the button

    document.getElementsByTagName('button')[0].dispatchEvent(clickEvent);
   // }   ,500)
    console.log('send-input-all-return',document.body.innerText)

    setTimeout(eval(`
        try {
            console.log('send-input-all-return',document.body.innerText)
            //ipcRenderer.send('send-input-all-return',document.body.innerText)
        } catch(e) {
          console.error(e);
        }`),2000)


  } catch(e) {
    console.error('Textarea not found',e);
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

       // console.log('MutationObserver:', mutation);

      if (mutation.type === 'characterData') {
        const oldValue = mutation.oldValue;
        const newValue = mutation.target.textContent;
       // console.log('Delta text:','\'' ,oldValue,'\'',' -> \'',newValue,'\'');

        // Calculate the delta text
        let deltaText = '';
          let trim = oldValue.trim()
         if (!trim.length || trim.length == 1 && trim.charCodeAt(0) == 8203 ) {
            deltaText = newValue
           // console.log('new value:','\'' ,oldValue,'\'',' -> \'',newValue,'\'');

         }else if (newValue.length > oldValue.length) {

            deltaText = newValue.substring(oldValue.length);
        //  console.log('new value > ','\'' ,oldValue,'\'',' -> \'',newValue,'\'');
         }

//        if(deltaText){
//            console.log('Delta text:', deltaText);
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

     //         console.log('Delta HTML:', deltaHTML);
     //          //if (hasTextContent(node)) {
     //              ipcRenderer.send('chat-gpt4-api-hack',deltaHTML)

     //          //}
     //    //}
     // }
    }
  });


  } catch(e) {
    // statements
    console.log(e);
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

console.log('preload Google-api hack')

