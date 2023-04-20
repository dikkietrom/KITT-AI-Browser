const pluginByName = {}
const pluginByDir = {}
const pluginById = {}
class Plugin {
    constructor(arg) {
        this.message = null

        pluginByName[this.constructor.name] = this
        pluginById[this.config().id] = this
        try {
            throw new Error()
        } catch (error) {
            let dir = error.stack
            let part = '/KITT/plugins'
            dir = dir.substring(dir.indexOf(part) + part.length + 1)
            dir = dir.substring(0, dir.indexOf('/'))

            pluginByDir[dir] = this
            log('dir', dir)
        }

        //add it to the plugin select
        try {
            let sel = document.getElementById('plugin-impl')
            let opt = document.createElement('option')
            sel.appendChild(opt)
            opt.innerHTML = this.constructor.name
            opt.value = this.constructor.name
            if (this.config().role == 'CEO') {
                opt.selected = true
            }
        } catch (error) {
            err(error)
        }

    }

    config() {
        throw new Error('config not implemented for ' + this.config().name)
    }
    exec(message) {
        throw new Error('exec not implemented for ' + this.config().name)
    }
    onBeforeSendHeaders(json) {
        throw new Error('onBeforeSendHeaders not implemented for ' + this.config().name)

    }

    send(key, message) {
        this.webView.send(key, message)
    }
}

function run() {
    log('start')
    get('console-view').innerHTML = ''
    let s = span(currentInp.parentElement)
    s.style.cursor = 'pointer'
    s.innerHTML = currentInp.value
    s.onclick = function() {
        currentInp.value = this.innerHTML
        currentInp.focus()
    }
    currentInp.outerHTML = ''
    ipcRenderer.send('tts-kitt', selVal('voices'))
    let message = new Message()
    let content = currentInp.value.trim()
    let toc = 0
    if (content.charAt(0) == '/') {
        let spaceIndex = content.indexOf(' ')
        let pluginId = content.substring(1, spaceIndex == -1 ? content.length : spaceIndex)
        message.to[0] = pluginById[pluginId]
        content = spaceIndex == -1 ? '' : content.substring(spaceIndex).trim()
    } else {
        message.to[0] = pluginById['ceo']
    }
    message.chain.push(message.to[0])

    let chainPos = content.indexOf('/')
    let chainSpec = chainPos == -1 ? '' : content.substring(chainPos)

    content = content.indexOf('/') == -1 ? content : content.substring(0, content.indexOf('/') - 1)

    if (chainPos != -1) {

        let chain = chainSpec.split('/')
        for (let index = 0; index < chain.length; index++) {
            let pluginId = chain[index]
            if (pluginId != chain && pluginId) {
                message.chain.push(pluginById[pluginId])
                message.to.push(pluginById[pluginId])
            }

        }
    }

    message.content = content

    message.from = pluginById['user']
    message.send()
}

function pluginReply(message) {
    try {
        log('plugin response : ', message)
        let pluginTo = message.to[0]
        let plgn = pluginTo ? pluginTo : message.chain[message.chain.length - 1]

        let replyTd = newPluginReplyRow(plgn.config().name, 'plugin-id')
        let container = div(replyTd)

        container.innerHTML = message.content

    } catch (error) {
        err(error)
    }
}

function newPluginReplyRow(who, cls) {
    let row = tr('layout')
    row.height = 0
    let cell = td(row)
    cell.onclick = function(event) {
        if (row.getElementsByClassName('speak').length == 0) {
            row.style.display = 'none'
        }

    }
    cell.className = '' + (cls ? cls : '')

    cell.innerHTML = `${who} : `

    cell = td(row)
    cell.className = 'plugin-reply'
    cell.colSpan = 2

    return cell
}
function newInp(container) {

    let td = newPluginReplyRow('Me', 'chat-id')

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

function codeBlocks(arg) {
    let index = message.indexOf('```')
    let code = ''
    let ret = []
    if (index != -1) {

        while (index != -1) {
            let d = document.createElement('span')
            d.innerHTML = '[code return]'
            arg.container.appendChild(d)
            code = message.substring(index + 3, message.indexOf('```', index + 3))
            message = message.substring(0, index) + message.substring(message.indexOf('```', index + 3) + 3)
            index = message.indexOf('```')
            d.innerHTML += '<pre onclick=eval(this.innerHTML) style=background-color:#fff7;padding:1em>' + code + '</pre>'
            code = code.trim()
            if (code.indexOf('python' == 0)) {
                ret.push(new Error("cannot directly execute python, include writing the python and executing it"))
            } else {
                ret.push(code)
            }

        }
    } else {
        return null
    }
    return ret

}
