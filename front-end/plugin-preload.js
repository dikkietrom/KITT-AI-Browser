const {ipcRenderer,contextBridge} = require('electron');
const { session } = require('electron');


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
    log('send-input hack')
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
        log('doInPreload' ,json.js)
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
 
window.addEventListener('DOMContentLoaded', () => {
   // addStartButton()
});

function addStartButton(){
  let startButton = document.createElement('button');
  startButton.innerText = 'Start Recording';
  startButton.addEventListener('click', () => {
    startRecording();
    startButton.remove();
  });
  document.body.appendChild(startButton);    
}

function getDomPath(el) {
  const stack = [];
  while ( el.parentNode != null ) {
    let sibCount = 0;
    let sibIndex = 0;
    for ( let i = 0; i < el.parentNode.childNodes.length; i++ ) {
      let sib = el.parentNode.childNodes[i];
      if ( sib.nodeName == el.nodeName ) {
        if ( sib === el ) {
          sibIndex = sibCount;
        }
        sibCount++;
      }
    }
    if ( el.hasAttribute('id') && el.id != '' ) {
      stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
    } else if ( sibCount > 1 ) {
      stack.unshift(el.nodeName.toLowerCase() + ':eq(' + sibIndex + ')');
    } else {
      stack.unshift(el.nodeName.toLowerCase());
    }
    el = el.parentNode;
  }
  return stack.slice(1); // removes the html element
}

function startRecording () {
  let events = [];
  const listener = (e) => {
    events.push({
      type: e.type,
      target: getDomPath(e.target).join(" > "),
      timestamp: e.timeStamp,
    });
    console.log('Recorded event:', e.type, 'on', getDomPath(e.target).join(" > "));
  };

  ['click', 'keyup', 'keydown', 'keypress'].forEach((eventType) => {
    document.addEventListener(eventType, listener);
  });

  let stopButton = document.createElement('button');
  stopButton.style.background = 'red' 
  stopButton.innerText = 'Stop Recording';
  stopButton.addEventListener('click', () => {
    ['click', 'keyup', 'keydown', 'keypress'].forEach((eventType) => {
      document.removeEventListener(eventType, listener);
    });
    console.log('Macro:', events);
    stopButton.remove();
    addStartButton()
  });

  document.body.appendChild(stopButton);
}
