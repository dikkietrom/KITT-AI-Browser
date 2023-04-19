class Google extends Plugin {
    constructor(arg) {
        super(arg)
        this.conversation = ''
    }
    listen(message, _container) {

        container = _container
    }
    speak() {

        try {
            log('Google-api-hack', currentInp.value)

            currentInput = currentInp.value.trim()
            this.webView.send('send-input-google', currentInput)
            pluginReply('')

        } catch (error) {

            err(error)
        }
    }
    config() {
        return {
            id: 'ggl',
            name: 'Google',
            description: 'Google',
            role: 'worker',
            active: true,
            url: "https://google.com/search?q=init"
        }
    }
    exec(message) {
        let result = ''

        this.webView.send('send-input-google', message.content)
        .then( alert('1') )
            

        
        return  "searching for \"" + message.content + "\""
    }
}

ipcRenderer.on('plugin-google-reply', (event,arg)=>{
    let obj = JSON.parse(arg)
    let message = obj.input ? obj.input.trim() : ''
    if (message) {
        //currentInp.value = "please read and summarize and give the best possible reply : " + message
        plugin()
    }
}
)

let google = new Google()
