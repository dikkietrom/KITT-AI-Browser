class OpenAssistant extends Plugin {
    constructor(arg) {
        super(arg)
        this.async = true
        this.streamer=true

    }

    config() {
        return {
            name: 'OpenAssistant',
            id: 'oa',
            description: 'OpenAssistant',
            role: 'CEOx',
            active: false,
            url: "https://open-assistant.io"
        }
    }
    onData(json) {
        if (json.url.indexOf('https://open-assistant.io/api/chat/events?chat_id') == 0) {
            if (this.message) {
                try {
                     this.container.innerHTML = '[CLEARED]'
                } catch (error) {
                        err(error)
                }
                let that = this
                setTimeout(() => that.message.send() ,100)
            }
        }
    }
    exec(message) {
        this.webView.send('send-input', message.content)
    }
}
ipcRenderer.on('oa-delta-text', (event,json)=>{
    if(oa.message){
        oa.message.content = json.data
        oa.container.innerText=json.data
        oa.container.scrollTop = oa.container.scrollHeight
    }
}
);


let oa = new OpenAssistant()
