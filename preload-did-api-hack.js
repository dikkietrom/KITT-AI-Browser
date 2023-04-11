// preload.js
const { ipcRenderer } = require('electron');


function txtArea(){
  return document.querySelector('[contenteditable="true"]');

}
document.addEventListener(
    'DOMContentLoaded',
    () => {
        document.body.style.overflow = 'hidden';
        let svgs = document.querySelectorAll('svg')
        console.log('svgs',svgs)

        let script = document.createElement('style')
        script.innerHTML = `svg,main > div > div{position:absolute;top:-10000px !important;left:-10000px !important;);)`
        document.body.appendChild(script)
        document.body.style.background = 'none'
     },
    false
);
 ipcRenderer.on('send-input-did', (event,arg) => {
    console.log('send-input-did',arg)

    triggerKeysOnTextarea(arg)
   setTimeout(()=>{
    triggerEnterKeyOnTextarea()
   ,500})


})

 function triggerKeysOnTextarea(txt) {
  try {
  //let pretxt = 'Alice, could you please repeat after me and start with: "'
    txtArea().focus();
    document.execCommand('insertText', false,  txt);
  } catch(e) {
    console.error(e);
  }
}
 function triggerEnterKeyOnTextarea() {
  try {
    txtArea().focus();
    let button = document.getElementsByTagName('button')[1];
    // Create a new MouseEvent object
    const clickEvent = new MouseEvent('click', {
      bubbles: true,       // Ensure the event bubbles up through the DOM
      cancelable: true,    // Allow the event to be canceled
      view: window,        // Set the view property to the current window
      detail: 1            // Set the click count (single click)
    });
     txtArea().blur();

// Dispatch the click event on the button
button.dispatchEvent(clickEvent);
  } catch(e) {
    console.error('Textarea not found',e);
  }
}
console.log('preload did hack')

