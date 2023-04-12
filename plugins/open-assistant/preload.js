// preload.js
const { ipcRenderer } = require('electron');


function txtArea(){
    //returns div with role textbox
    return document.querySelector('[role="textbox"]')

}
document.addEventListener(
    'DOMContentLoaded',
    () => {
     // initMutationObserver()


    },
    false
);
 ipcRenderer.on('send-input', (event,arg) => {
    console.log('send-input',arg)
//    txtArea().innerHTML=arg
        
  //  const targetNode = document.getElementsByTagName('main')[0]
   // observer.observe(targetNode, config)
  //  triggerEnterKeyOnTextarea()
   // txtArea().focus()
    //document.execCommand('insertText', false, arg)
// Select the element where the range will be created

 txtArea().focus()
  const range = document.createRange();

  // Event listener for text selection




      range.setStart(window.getSelection().anchorNode, window.getSelection().anchorOffset);
      range.setEnd(window.getSelection().focusNode, window.getSelection().focusOffset);

      const newTextNode = document.createTextNode(arg);
      range.deleteContents();
      range.insertNode(newTextNode);

 txtArea().focus()
triggerEnterKeyOnTextarea()


})

 function triggerEnterKeyOnTextarea() {
  try {
   const inputEvent = new KeyboardEvent("input", {
        bubbles: true,
        cancelable: true,
        key: "Enter",
        charCode: 13,
        keyCode: 13,
      });

    txtArea().dispatchEvent(inputEvent);
  } catch(e) {
    console.error('Textarea not found',e);
  }
}

console.log('preload OpenAssistant-api hack')

