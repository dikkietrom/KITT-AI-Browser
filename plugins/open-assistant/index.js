class OpenAssistant extends Chat {
    constructor(arg) {
        super(arg)
        this.conversation = ''
    }
    listen(message, _container) {

        container = _container
    }
    speak() {

        try {
            console.log('OpenAssistant-api-hack',currentInp.value)
            
            currentInput = currentInp.value.trim()
            this.webView.send('send-input', currentInput)
            chatReply('')

        } catch (error) {
            let m = `mj-api-hack Error: ${error.message}`

            console.log(m)
        }
    }
    config() {
        return {
            name: 'OpenAssistant',
            description: 'OpenAssistant',
            url: "https://open-assistant.com"
        }
    }
}


new MjApiHack()
