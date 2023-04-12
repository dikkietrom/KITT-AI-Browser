const chats = {}
var chatsArr = []
class Chat {
    constructor(arg) {
        chats[this.constructor.name] = this
        chatsArr.push(this)
        //add it to the plugin select
        try {
            let sel = document.getElementById('chat-impl')
            let opt = document.createElement('option')
            sel.appendChild(opt)
            opt.innerHTML = this.constructor.name
            opt.value = this.constructor.name
        }catch (error) {
            console.log(error)
        }

    }
    speak(message) {}
    listen(message, container) {
        container.innerHTML += message
    }
    config() {
        return {}
    }
    onBeforeSendHeaders(json){
        
    }
    send(key,message){
        this.webView.send(key, message)
    }
}

ipcRenderer.on('chat-reply', (event,token)=>{
    chatReply(token)

}
);
function chatReturn(append) {
    let ret = document.getElementById('layout')
    if (append.tagName != 'TR') {
        alert('chatReturn() expects a TR element')
        return
    }
    if (append) {
        ret.appendChild(append)
    }

}
function chatReply(token) {
    try {
        console.log('chat response : ', token)

        let td = newChatReplyRow(chatImpl().constructor.name, 'chat-id-ai')
        chatImpl().listen(token, td)

        newInp()

    } catch (error) {
        console.log(error)
    }
}
function newChatReplyRow(who, cls) {
    let tr = document.createElement('tr')

    tr.height = 0
    let td = document.createElement('td')
    td.onclick = function(event) {
        if (tr.getElementsByClassName('speak').length == 0) {
            tr.style.display = 'none'
        }

    }
    td.className = 'chat-id ' + (cls ? cls : '')
    tr.appendChild(td)
    td.innerHTML = `${who} : `

    td = document.createElement('td')
    td.className = 'chat-reply'
    td.colSpan = 2
    tr.appendChild(td)
    chatReturn(tr)
    return td
}
function newInp(container) {

    let td = newChatReplyRow('Me')

    let inp = document.createElement('textarea')
    inp.className = 'speak'
    inp.onkeydown = (event)=>{
        textInputListener(this, event)
    }

    td.appendChild(inp)

    inp.value = ''
    inp.focus()
    document.body.scrollHeight = document.body.scrollTop
    currentInp = inp

}
function chatImpl() {
    let sel = document.getElementById('chat-impl')
    return chats[sel.value]
}
function chat() {
    let pre = document.createElement('span')
    pre.style.cursor = 'pointer'
    pre.innerHTML = currentInp.value
     pre.onclick = function() {
         currentInp.value = this.innerHTML
         currentInp.focus()
     }

    currentInp.parentElement.appendChild(pre)
    currentInp.outerHTML = ''
    ipcRenderer.send('tts-kitt', selVal('voices'))
    chatImpl().speak()
}

ipcRenderer.on('tts-d-id-stream', (event, arg) => {
    alert(arg)
})
