class Google extends Plugin {
    constructor(arg) {
        super(arg)
        this.async=true
    }

    config() {
        return {
            id: 'ggl',
            name: 'Google',
            description: 'Google',
            role: 'worker',
            active: false,
            url: "https://google.com"
        }
    }
    exec(message) {
        this.webView.send('send-input-google', message.content)
    }
}

ipcRenderer.on('plugin-google-reply', (event,json)=>{

    log('plugin-google-reply')
    let message = google.message
    if (message) {
        let obj = JSON.parse(json)
        message.content = obj.input ? obj.input.trim() : ''
       
        message.send()
    }
}
)

let google = new Google()
