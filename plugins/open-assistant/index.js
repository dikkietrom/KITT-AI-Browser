class OpenAssistant extends Plugin {
    constructor(arg) {
        super(arg)
        this.conversation = ''
    }
    listen(message, _container) {

        container = _container
    }
    speak() {

        try {
            log('OpenAssistant-api-hack',currentInp.value)
            
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
            name: 'OpenAssistant',
            description: 'OpenAssistant',
            role: 'manager',
            url: "https://open-assistant.io"
        }
    }
}


new OpenAssistant()
