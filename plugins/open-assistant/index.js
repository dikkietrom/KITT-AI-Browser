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
            err(error) 
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
