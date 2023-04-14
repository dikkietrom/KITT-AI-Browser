ipcRenderer.on('onBeforeSendHeaders', (event,arg)=>{
    // log('onBeforeSendHeaders', arg)

    const domain = extractDomain(arg.url);

    let plugin = plugByUrl[domain]
    if (plugin && plugin.onBeforeSendHeaders) {
        try {
            plugin.onBeforeSendHeaders(JSON.parse(arg.buffer))
        } catch (error) {
            log(error)
        }
    }
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
        let script = document.createElement('script')
        let src = '../plugins/' + dir + '/index.js'
        log(src)
        script.src = src
        document.body.appendChild(script)

        script.onload = (arg)=>{
            log(arg)
            let plugin = pluginByDir[dir]
            if (plugin.config().url) {
                let tab = onScriptLoad({
                    index: index,
                    dir: dir,
                    plugin:plugin
                })
                
                let i = index++
                tab.onclick = ()=>{
                    showTab(i)
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
        addLog(div('console-view'), mes)
    } catch (error) {
        log(error)
    }
}
);

ipcRenderer.on('preload-log', (event,mes)=>{
    console.log(mes.join(' '))
    try {
        addLog(div('console-view'), mes)
    } catch (error) {
        log(error)
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
    let div1 = div('webviews')
    div1.className = 'tab-content'
    let div2 = div(div1)
    let webview = document.createElement('webview')
    plugin.webView = webview
    webview.id = pluginDir + '-view'
    webview.src = plugin.config().url
    webview.preload = '../plugins/' + pluginDir + '/preload.js'

    div2.appendChild(webview)
    let div3 = div(div2)
    div3.className = 'button-bar'
    let button = document.createElement('button')
    button.className = 'command'
    button.innerHTML = 'Show webview'
    button.onclick = function() {
        toggleWebView(this, pluginDir + '-view')

    }
    div3.appendChild(button)
    let button2 = document.createElement('button')
    button2.className = 'command'
    button2.innerHTML = 'Debug'
    button2.onclick = function() {
        toggleDevTools(this, pluginDir + '-view')

    }
    webview.debugButton = button2
    div3.appendChild(button2)

}
