class Youtube extends Chat {
    constructor(arg) {
        super(arg)
        this.conversation = ''
    }
    listen(message, _container) {

        container = _container
    }
    speak() {

        try {
            console.log('Youtube-api-hack',currentInp.value)
            
            currentInput = currentInp.value.trim()
            this.webView.send('send-input', currentInput)
            chatReply('')

        } catch (error) {
            let m = `Youtube-api-hack Error: ${error.message}`

            console.log(m)
        }
    }
    config() {
        return {
            name: 'Youtube',
            description: 'Youtube',
            url: "https://youtube.com"
        }
    }
}


new Youtube()
