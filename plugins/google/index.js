class Google extends Plugin {
    constructor(arg) {
        super(arg)
    }
    onBeforeSendHeaders(json) {
        //not in use

    }
    config() {
        return {
            id: 'ggl',
            name: 'Google',
            description: 'Google',
            role: 'worker',
            active: true,
            url: "https://google.com"
        }
    }
    exec(message) {
        this.message = message       
        this.webView.send('send-input-google', message.content)
        return `searching for "${message.content}"`
    }

    
}
ipcRenderer.on('plugin-google-reply', (event,json)=>{
    // log('plugin-google-reply')
    // let message = google.message
    // if (message) {
    //     let obj = JSON.parse(json)
    //     message.content = obj.input ? obj.input.trim() : ''
    //     google.message = null
    //     message.send()
    // }
}
)

let google = new Google()
