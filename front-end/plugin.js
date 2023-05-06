const pluginByName = {}
const pluginByDir = {}
const pluginById = {}
const pluginByRole = {}
class Plugin {
    constructor(arg) {
        this.async = false
        this.streamer = false
        pluginByName[this.constructor.name] = this
        pluginById[this.config().id] = this

        try {
            throw new Error()
        } catch (error) {
            let dir = error.stack.split('\n')
            dir = dir[dir.length - 1]
            let part = '/plugins/'
            let index = dir.indexOf(part)
            if (index == -1) {
                dir = extractPluginDirFromAsar(dir)
            } else {
                dir = dir.substring(index + part.length )

                dir = dir.substring(0, dir.indexOf('/'))
            }

            pluginByDir[dir] = this
            let role = this.config().role
            pluginByRole[role] = pluginByRole[role] ? pluginByRole[role] : []
            pluginByRole[role].push(this)
            this.dir = dir
            log(dir)
        }

 

    }
    onInitMenu(menu) {

    }
    onReplied(message) {

    }
    config() {
        throw new Error('config not implemented for ' + this.config().name)
    }
    exec(message) {
        throw new Error('exec not implemented for ' + this.config().name)
    }
    onData(json) {
    }
    onFetchResponse(json) {
    }
    onFetchRequest(json) {
    }
    onTimeOut() {
        if (this.message) {
            try {
                log('timed out',this.webView)
                this.webView.send('html-get-last')
            } catch(e) {
                log(e,this.message);
            }
        }
        this.timeoutId = null
    }
    startTimer() {
        this.stopTimer()
        let that = this
        this.timeoutId = setTimeout(()=>{
            this.onTimeOut()
        }
        , 2000);
        // Cancel the timeout
    }
    stopTimer() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId)
        }
    }

    send(key, message) {
        this.webView.send(key, message)
    }
}
const seperator = '\u00bb'
function run() {
    log('start')
    get('console-view').innerHTML = ''
    get('console-view-parent').className=''
    let s = span(currentInp.parentElement)
    s.style.cursor = 'pointer'
    s.innerHTML = currentInp.value
    s.onclick = function() {
        currentInp.value = this.innerHTML
        currentInp.focus()
    }
    currentInp.outerHTML = ''
 
    let message = new Message()
    let content = currentInp.value.trim()
    let toc = 0
    if (content.charAt(0) == seperator) {
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
        message.to[0] = Plugin.active
    }
    message.chain.push(message.to[0])

    let chainPos = content.indexOf(seperator)
    let chainSpec = chainPos == -1 ? '' : content.substring(chainPos)

    content = content.indexOf(seperator) == -1 
        ? content 
        : content.substring(0, content.indexOf(seperator) - 1)

    if (chainPos != -1) {

        let chain = chainSpec.split(seperator)
        for (let index = 0; index < chain.length; index++) {
            let pluginId = chain[index]
            if (pluginId != chain && pluginId){
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
        let pluginTo = message.lockedBy ? message.lockedBy : message.to[0]
        let plgn = pluginTo ? pluginTo : message.chain[message.chain.length - 1]

        let replyTd = newPluginReplyRow(plgn, 'plugin-id')
        let container = div(replyTd)
        let content = message.content
        if (content && content.startsWith && content.startsWith('<div')) {
            container.innerHTML = content
        } else {
            container.innerText = content
        }
        plgn.onReplied(container)
        container.onclick = (e)=>{
            if (currentInp) {
                currentInp.value = e.target.innerText
            }
        }
        return container
    } catch (error) {
        err(error)
    }
}

function newPluginReplyRow(plugin, cls) {
    let row = document.createElement('tr')
    row.className = 'reply-row'
    let layout = get('layout')
    let tbody = layout.getElementsByTagName('tbody')[0]
    tbody.insertBefore(row, tbody.children[1])

    row.height = 0
    let cell = td(row)
    cell.onclick = function(event) {
        if (row.getElementsByClassName('speak').length == 0) {
            row.style.display = 'none'
        }

    }
    cell.className = '' + (cls ? cls : '')

    cell.innerHTML = `${plugin.config().name} : `

    let icon = div(cell)
    icon.className = 'plugin-icon'

    const imageUrl = `../plugins/${plugin.dir}/icon.png`

    // Set the background image to the image URL
    if(plugin.config().icon){
      icon.style.backgroundImage = `url(${imageUrl})`;
    };


    cell = td(row)
    cell.className = 'plugin-reply'
    cell.colSpan = 2

    return cell
}
function newInp(container) {
    
    let td = newPluginReplyRow( pluginById['user'] , 'chat-id')

    let inp = document.createElement('textarea')
    inp.className = 'speak'
    inp.spellcheck = false
    inp.onkeydown = (event)=>{
        textInputListener(inp, event)
    }

    td.appendChild(inp)

    inp.value = ''
    inp.focus()
    //document.body.scrollTop = document.body.scrollHeight
    currentInp = inp

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
