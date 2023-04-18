class Youtube extends Plugin {
    constructor(arg) {
        super(arg)
        this.conversation = ''
    }
    listen(message, _container) {

        container = _container
    }
    speak() {

        try {
            log('Youtube-api-hack',currentInp.value)
            
            currentInput = currentInp.value.trim()
            this.webView.send('send-input', currentInput)
            pluginReply('')

        } catch (error) {
            err(error) 
        }
    }
    config() {
        return {
            name: 'Youtube',
            description: 'Youtube',
            role: 'worker',
            active: false,
            url: "https://youtube.com"
        }
    }
}


new Youtube()
