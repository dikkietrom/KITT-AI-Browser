let currentInp
let replyLen = 0
init.cnt = 0

ipcRenderer.on('main-log', (event,mes)=>{

    console.log('main-log : ', mes)
}
);

ipcRenderer.on('chat-gpt4-api-hack-front', (event,arg)=>{
    // Send input data to the renderer process
    console.log('chat-gpt4-api-hack-main ipcRenderer', arg)
    ipcRenderer.send('chat-reply', arg);
    //document.body.innerHTML+=arg

}
);
ipcRenderer.on('did-tts', (event,arg)=>{

    didView.send('send-input-did', arg)

}
);

let gpt4View
let didView
let mjView
document.addEventListener('DOMContentLoaded', ()=>{

    gpt4View = document.getElementById('gpt4-view');

    if (gpt4View) {
        gpt4View.addEventListener('dom-ready', ()=>{//gpt4View.openDevTools();
        }
        );
    }
    didView = document.getElementById('did-view');

    if (didView) {
        didView.addEventListener('dom-ready', ()=>{// didView.openDevTools();
        }
        );
    }
    mjView = document.getElementById('mj-view');

    if (mjView) {
        mjView.addEventListener('dom-ready', ()=>{
            mjView.openDevTools();
        }
        );
    }
}
);

function init() {
    document.getElementById('inp').focus()
    if (!currentInp) {
        currentInp = document.getElementById('inp')
    }

    let startupAudio = new Audio('tune.mp3')
    startupAudio.currentTime = 1;

    startupAudio.play();
    let chatImpl = document.getElementById('chat-impl')
    for (let p in chats) {
        let cht = chats[p]
        let option = document.createElement('option')
        chatImpl.appendChild(option)
        option.innerHTML = p
        option.chatImpl = cht
    }
    ipcRenderer.send('stts-main')
    ipcRenderer.send('gpt-models')

}

function textInputListener(input, event) {
    try {
        if (event.key === 'Enter') {
            chat()
            event.preventDefault();
            return false
        }
    } catch (error) {
        console.log(textInputListener.constructor.name, error)
    }
}
function text(txt) {
    let pre = document.createElement('span')
    pre.innerHTML = txt
    return pre

}
function selVal(id) {
    let sel = document.getElementById(id)
    return sel[sel.selectedIndex].value
}

function toggleWebView(button) {
    let webview = button.previousElementSibling
    if (!webview.hidden) {
        webview.style.height = '0px'
        button.innerHTML = 'Show webview'
        button.style.top = '0em'
        webview.hidden = true
    } else {
        webview.style.height = '400px'
        button.innerHTML = 'Hide webview'
        button.style.position = 'relative'
        button.style.top = '-2em'
        webview.hidden = false
    }
}
