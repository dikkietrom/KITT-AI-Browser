class Gpt4apiHack extends Plugin {
    constructor(arg) {
        super(arg)
        this.async = true
    }

    config() {
        return {
            name: 'Gpt4ApiHack',
            id: 'gpt',
            description: 'Gpt4ApiHack',
            role: 'CEO',
            active: true,
            url: "https://chat.openai.com/"
        }
    }
    exec(message) {
        this.webView.send('send-input', message.content)
    }

    onBeforeSendHeaders(messages) {

        if (this.message) {
            for (let index = 0; index < messages.length; index++) {
                let m = messages[index]
                let content = this.message.content
                m.input = m.input && m.input.trim ? m.input.trim() : m.input
                let cnd = m.input && m.input.indexOf && (m.input.indexOf(content + '\n') == 0 || m.input.indexOf(this.reply + '\n') == 0)
                if (m.input && m.input.indexOf && cnd) {
                    this.message.content = m.input.substring(m.input.indexOf(content) + content.length + 2)
                    this.reply = this.message.content
                    this.message.send()
                }
            }
        }
    }
}

ipcRenderer.on('plugin-gpt4-api-hack-front', (event,arg)=>{
    // Send input data to the renderer process
    log('plugin-gpt4-api-hack-main ipcRenderer', arg)
    ipcRenderer.send('plugin-reply', arg);
    //document.body.innerHTML+=arg

}
);

let gpt4apiHack = new Gpt4apiHack()
