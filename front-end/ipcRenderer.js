ipcRenderer.on('onBeforeRequest', function onBeforeRequest_IPC(event, json){
    let plugin = pluginById[json.partition.substring(8)]
    if (plugin) {
        plugin.onFetchRequest(json)
    }
})
ipcRenderer.on('onHeadersReceived', function onHeadersReceived_IPC (event,json){
    let plugin = pluginById[json.partition.substring(8)]
    if (plugin) {
        plugin.onFetchResponse(json)
    }
}
);

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

ipcRenderer.on('plugin-message', (event,json)=>{

    log('plugin-message sortedDirs : ', json)

    let index = 0
    for(let dir in json){
        let info = json[dir]
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
                        plugin: plugin,
                        info:info
                    })
                    let i = index++
                    tab.onclick = ()=>{
                        showTab(i)
                    }
                }
            }
        }
    }
}
)

ipcRenderer.on('main-log', (event,mes)=>{
    mainLog(event,mes)
}
);
ipcRenderer.on('preload-log', (event,mes)=>{
    preloadLog(event,mes)
}
);

function onScriptLoad(arg) {
    let index = arg.index
    let dir = arg.dir
    let plugin = arg.plugin
    let info = arg.info
    log('dir plugin.config : ', dir, JSON.stringify(plugin.config()))

    plugByUrl[extractDomain(plugin.config().url)] = plugin
    //add to the tabbar like <button class="tab" onclick="showTab(3)">Youtube</button>
    let tab = document.createElement('button')
    let tabbar = document.getElementById('webview-tab-bar')

    tab.className = 'tab'

    tab.innerHTML = plugin.config().name

    tabbar.appendChild(tab)

    addWebView(dir, plugin, info)
    if (index == 0) {
        tab.className = 'tab active'
        showTab(0)
    }
    if (plugin.config().role == 'CEO') {
        showTab(index)
    }
    return tab
}

async function addWebView(pluginDir, plugin,info) {
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
    let plgWebView = webview()
    plugin.webView = plgWebView
    plgWebView.partition = 'persist:' + plugin.config().id
    plgWebView.id = pluginDir + '-view'
    plgWebView.src = plugin.config().url
    if(info.preload){
        plgWebView.preload = '../plugins/' + pluginDir + '/preload.js'
    }else{
        plgWebView.preload = '../front-end/plugin-preload.js'
    }
    let t = plgWebView
    plgWebView.addEventListener('dom-ready', () => {
        //ipcRendererenderer.send('attach-debugger',t.getWebContentsId())
    });
    main.appendChild(plgWebView)//append after config or no preload
                    
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
    let custButton = button()
    custButton.className = 'command'    
    let custSelect = select()
    plugin.onInitMenu({menu:bar,button:custButton,select:custSelect}) 

    let urlBox = span(bar)
    urlBox.innerHTML = plgWebView.src
    urlBox.className = 'urlBox'
    plugin.menu = bar
    plgWebView.urlBox = urlBox

   

}
