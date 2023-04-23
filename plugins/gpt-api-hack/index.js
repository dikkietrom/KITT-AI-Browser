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

    onData(json) {
        console.log(json.url)
        if (json.url.indexOf('https://chat.openai.com/backend-api/moderations') == 0) {
       // if (json.url.indexOf('https://chat.openai.com/backend-api/conversations?offset') == 0) {
            if (this.message) {
 

                console.log('onData ' + gpt4apiHack.container)
                this.webView.send('get-last')

            }
        }
    }
}

ipcRenderer.on('gpt-hack-delta-text', (event,json)=>{
    if (gpt4apiHack.message) {
        console.log(json)
        gpt4apiHack.message.content = json.data
        gpt4apiHack.container.innerText = json.data
    }
}
);
ipcRenderer.on('get-last', (event,last)=>{
    if (gpt4apiHack.message) {
        // Send input data to the renderer process
        console.log('get last index ' + gpt4apiHack.container)
        gpt4apiHack.message.content = last
        try {
            gpt4apiHack.container.innerText = '[CLEARED]'
        } catch (error) {
            err(error)
        }
        gpt4apiHack.message.send()
    }
}
);

let gpt4apiHack = new Gpt4apiHack()
