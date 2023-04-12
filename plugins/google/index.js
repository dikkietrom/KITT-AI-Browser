class Google extends Chat {
    constructor(arg) {
        super(arg)
        this.conversation = ''
    }
    listen(message, _container) {

        container = _container
    }
    speak() {

        try {
            console.log('Google-api-hack',currentInp.value)
            
            currentInput = currentInp.value.trim()
            this.webView.send('send-input-google', currentInput)
            chatReply('')

        } catch (error) {
            let m = `mj-api-hack Error: ${error.message}`

            console.log(m)
        }
    }
    config() {
        return {
            name: 'Google',
            description: 'Google',
            url: "https://google.com/search?q=init"
        }
    }
}
ipcRenderer.on('chat-google-reply', (event,arg)=>{
        let obj = JSON.parse(arg)
        let message = obj.input ? obj.input.trim() : ''
        if(message){
             currentInp.value = "please read and summarize and give the best possible reply : " + message
             chat()
        }
})

function search(txt) {
    google.send('send-input-google', txt)
}
let google = new Google()
