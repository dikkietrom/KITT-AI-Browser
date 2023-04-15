
const pluginByName = {}
const pluginByDir = {}
class Plugin {
    constructor(arg) {
        pluginByName[this.constructor.name] = this
        
        try {
            throw new Error()
        } catch (error) {
            let dir = error.stack
            let part = '/KITT/plugins'
            dir = dir.substring(dir.indexOf(part)+part.length+1)
            dir = dir.substring(0,dir.indexOf('/'))
            
            pluginByDir[dir]=this
            log('dir',dir)
        }

        //add it to the plugin select
        try {
            let sel = document.getElementById('plugin-impl')
            let opt = document.createElement('option')
            sel.appendChild(opt)
            opt.innerHTML = this.constructor.name
            opt.value = this.constructor.name
            if(this.config().role=='CEO'){
                opt.selected = true
            }
        }catch (error) {
            err(error)
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

ipcRenderer.on('plugin-reply', (event,token)=>{
    pluginReply(token)

}
);
function pluginReturn(append) {
    let ret = document.getElementById('layout')
    if (append.tagName != 'TR') {
        alert('pluginReturn() expects a TR element')
        return
    }
    if (append) {
        ret.appendChild(append)
    }

}
function pluginReply(token) {
    try {
        log('plugin response : ', token)

        let td = newPluginReplyRow(pluginImpl().constructor.name, 'plugin-id-ai')
        pluginImpl().listen(token, td)

        newInp()

    } catch (error) {
        err(error)
    }
}
function newPluginReplyRow(who, cls) {
    let tr = document.createElement('tr')

    tr.height = 0
    let td = document.createElement('td')
    td.onclick = function(event) {
        if (tr.getElementsByClassName('speak').length == 0) {
            tr.style.display = 'none'
        }

    }
    td.className = 'plugin-id ' + (cls ? cls : '')
    tr.appendChild(td)
    td.innerHTML = `${who} : `

    td = document.createElement('td')
    td.className = 'plugin-reply'
    td.colSpan = 2
    tr.appendChild(td)
    pluginReturn(tr)
    return td
}
function newInp(container) {

    let td = newPluginReplyRow('Me')

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
function pluginImpl() {
    let sel = document.getElementById('plugin-impl')
    return pluginByName[sel.value]
}
function plugin() {
    log('start')
    get('console-view').innerHTML=''
    let s = span(currentInp.parentElement)
    s.style.cursor = 'pointer'
    s.innerHTML = currentInp.value
     s.onclick = function() {
         currentInp.value = this.innerHTML
         currentInp.focus()
     }

    currentInp.outerHTML = ''
    ipcRenderer.send('tts-kitt', selVal('voices'))
    pluginImpl().speak()
}

ipcRenderer.on('tts-d-id-stream', (event, arg) => {
    alert(arg)
})
