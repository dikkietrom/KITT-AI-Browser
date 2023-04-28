ipcRenderer.on('onBeforeSendHeaders', function onBeforeSendHeaders_IPC(event, arg) {
    // log('onBeforeSendHeaders', arg)

    const domain = extractDomain(arg.url);

    let plugin = plugByUrl[domain]

    if (plugin) {
        try {
            let arr = []

            let buffers = arg.buffer

            for (let index = 0; index < buffers.length; index++) {
                if (buffers[index]) {
                    try {
                        arr[index] = JSON.parse(buffers[index])
                    } catch (error) {
                        arr[index] = error
                    }
                }

            }
            plugin.onData(arr)
        } catch (error) {
            err(error)
        }
    }
})

ipcRenderer.on('plugin-reply', (event,token)=>{
    pluginReply(token)

}
);
//bash-reply
ipcRenderer.on('bash-reply', (event,arg)=>{
    // Send input data to the renderer process
    log('bash-reply', arg)
    currentInp.value = arg
    //run()

}
)
ipcRenderer.on('dev-tools-closed', (event,arg)=>{
    let but = document.getElementById('front-debug')
    but.innerHTML = 'Debug'
    but.state = 'd'
}
)

ipcRenderer.on('plugin-message', (event,sortedDirs)=>{

    log('plugin-message sortedDirs : ', sortedDirs)

    let index = 0

    sortedDirs.forEach(dir=>{
        log('initPlugins dir : ', dir);
        if (dir != '.DS_Store') {
            let script = document.createElement('script')
            let src = '../plugins/' + dir + '/index.js'
            log(src)
            script.src = src
            document.body.appendChild(script)

            script.onload = (arg)=>{
                let plugin = pluginByDir[dir]
                if (plugin.config().url && plugin.config().active) {
                    let tab = onScriptLoad({
                        index: index,
                        dir: dir,
                        plugin: plugin
                    })

                    let i = index++
                    tab.onclick = ()=>{
                        showTab(i)
                    }

                }
            }

        }

    }
    )
}
)

ipcRenderer.on('main-log', (event,mes)=>{
    console.log(mes.join(' '))
    try {
        addLog({
            messages: mes
        })
    } catch (error) {
        err(error)
    }
}
);
ipcRenderer.on('preload-log', (event,mes)=>{
    console.log(mes.join(' '))
    try {
        addLog({
            messages: mes
        })
    } catch (error) {
        err(error)
    }
}
);
ipcRenderer.on('ses.webRequest.onCompleted', (event,json)=>{
    let plugin = pluginById[json.partition.substring(8)]
    if (plugin) {
        plugin.onData(json)
    }

}
);

function onScriptLoad(arg) {
    let index = arg.index
    let dir = arg.dir
    let plugin = arg.plugin
    log('dir plugin.config : ', dir, JSON.stringify(plugin.config()))

    plugByUrl[extractDomain(plugin.config().url)] = plugin
    //add to the tabbar like <button class="tab" onclick="showTab(3)">Youtube</button>
    let tab = document.createElement('button')
    let tabbar = document.getElementById('webview-tab-bar')

    tab.className = 'tab'

    tab.innerHTML = plugin.config().name

    tabbar.appendChild(tab)

    addWebView(dir, plugin, index)
    if (index == 0) {
        tab.className = 'tab active'
        showTab(0)
    }
    if (plugin.config().role == 'CEO') {
        showTab(index)
    }
    return tab
}

function addWebView(pluginDir, plugin) {
    //add the webview like
    //    <div class="tab-content">
    //       <div>
    //           <webview id="oa-view" src="https://open-assistant.io"></webview>
    //           <div class="button-bar">
    //               <button class="command" onclick="toggleWebView(this,'oa-view')">Show webview</button>
    //               <button class="command" onclick="toggleDevTools(this,'oa-view')">Debug</button>
    //           </div>
    //       </div>
    //   </div>
    let tabContent = div('webviews')
    tabContent.className = 'tab-content'
    let main = div(tabContent)
    let plgWebView = webview(main)
    plugin.webView = plgWebView
    plgWebView.partition = 'persist:' + plugin.config().id
    plgWebView.id = pluginDir + '-view'
    plgWebView.src = plugin.config().url
    plgWebView.preload = '../plugins/' + pluginDir + '/preload.js'

    
    let bar = div(main)
    bar.className = 'button-bar'
    let toggleViewButton = button(bar)
    toggleViewButton.className = 'command'
    toggleViewButton.innerHTML = 'Show webview'
    toggleViewButton.onclick = function() {
        toggleWebView(this, pluginDir + '-view')

    }
    

    let debugButton = button(bar)
    debugButton.className = 'command'
    debugButton.innerHTML = 'Debug'
    debugButton.onclick = function() {
        toggleDevTools(this, pluginDir + '-view')

    }
    plgWebView.debugButton = debugButton

    let urlBox = div(bar)
    urlBox.innerHTML=plgWebView.src
    urlBox.className='urlBox'

    plgWebView.urlBox = urlBox

}
