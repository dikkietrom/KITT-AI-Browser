class MjApiHack extends Plugin {
    constructor(arg) {
        super(arg)
        this.conversation = ''
    }
    listen(message, _container) {

        container = _container
    }
    speak() {

        try {
            log('mj-api-hack',currentInp.value)
            
            currentInput = currentInp.value.trim()
            this.webView.send('send-input', currentInput)
            pluginReply('')

        } catch (error) {
            let m = `mj-api-hack Error: ${error.message}`

            log(m)
        }
    }
    config() {
        return {
            name: 'MjApiHack',
            description: 'MjApiHack',
            role: 'worker',
            skill: 'tti',
            url: "https://discord.com/channels/@me/1093057901330968647"
        }
    }
}

ipcRenderer.on('plugin-mj-api-hack-reply', (event,arg)=>{

  
}
);

new MjApiHack()
