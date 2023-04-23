const pluginByName = {}
const pluginByDir = {}
const pluginById = {}
const pluginByRole = {}
class Plugin {
    constructor(arg) {
        this.async = false

        pluginByName[this.constructor.name] = this
        pluginById[this.config().id] = this
        try {
            throw new Error()
        } catch (error) {
            let dir = error.stack.split('\n')
            dir = dir[dir.length - 1]
            let part = '/KITT/plugins'
            let index = dir.indexOf(part)
            if (index == -1) {
                dir = extractPluginDirFromAsar(dir)
            } else {
                dir = dir.substring(index + part.length + 1)

                dir = dir.substring(0, dir.indexOf('/'))
            }

            pluginByDir[dir] = this
            let role = this.config().role
            pluginByRole[role] = pluginByRole[role] ? pluginByRole[role] : []
            pluginByRole[role].push(this)
            log(dir)
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
    onData(json) {
 
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
        if (!message.to[0]) {
            message.to = []
            message.from = pluginById['user']
            message.chain.push(pluginById['broker'])
            message.content = `plugin with id ${pluginId} not found`
            message.send()
            return
        }
        content = spaceIndex == -1 ? '' : content.substring(spaceIndex).trim()
    } else {
        message.to[0] = pluginByRole['CEO'][0]
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
        log('plugin response : ', message.content)
        let pluginTo = message.lockedBy ? message.lockedBy : message.to[0]
        let plgn = pluginTo ? pluginTo : message.chain[message.chain.length - 1]

        let replyTd = newPluginReplyRow(plgn.config().name, 'plugin-id')
        let container = div(replyTd)

        container.innerText = message.content
        return container
    } catch (error) {
        err(error)
    }
}

function newPluginReplyRow(who, cls, pos) {
    let row = document.createElement('tr')
    let layout = get('layout')
    let tbody = layout.getElementsByTagName('tbody')[0]
    tbody.insertBefore(row, tbody.children[2])
    //layout.appendChild( row)

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
    //document.body.scrollTop = document.body.scrollHeight
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
function extractPluginDirFromAsar(path) {
    const pattern = /app\.asar\/plugins\/([^/]+)\//;
    const match = path.match(pattern);

    if (match && match[1]) {
        return match[1];
    } else {
        return null;
    }
}
