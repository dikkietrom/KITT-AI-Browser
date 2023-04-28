class Youtube extends Plugin {
    constructor(arg) {
        super(arg)
     }
    exec(message){
        this.webView.send('send-input', message.content)
    }
    config() {
        return {
            name: 'Youtube',
            description: 'Youtube',
            id: 'yt',
            role: 'worker',
            active: false,
            url: "https://youtube.com"
        }
    }
}
ipcRenderer.on('plugin-youtube-reply', (event,json)=>{
    log('plugin-youtube-reply')
    let message = youtube.message
    if (message) {
        let obj = JSON.parse(json)
        message.content = obj.input ? obj.input.trim() : ''

        message.send()
    }
}
)


let youtube = new Youtube()
