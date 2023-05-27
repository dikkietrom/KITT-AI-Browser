class Gpt4apiHack extends Plugin {
    constructor(arg) {
        super(arg)
        this.async = true
        this.streamer = true

    }

    config() {
        return {
            name: 'Gpt4ApiHack',
            id: 'gpt',
            description: 'Gpt4ApiHack',
            role: 'CEO',
            active: true,
            icon: 'icon.png',
            url: "https://chat.openai.com/"
        }
    }
    exec(message) {
        this.webView.send('send-input', message.content)
    }
    onData(json) {
            console.log(json)
    }
    onReplied(container) {
        if (container.children[0]) {//  let child = container.children[0].children[0].children[1].children[0].children[0]

        //  container.removeChild(container.children[0])
        //  container.appendChild(child)

        }
    }
    onFetchRequest(data) {
      // if(data.buffer && data.buffer[0]) console.log(data.buffer)
    }

}

ipcRenderer.on('external-request-gpt-api-hack', (event,json)=>{
    gpt4apiHack.webView.send('send-input', json)
}
)
ipcRenderer.on('html-get-last-http-request', (event,json)=>{
    gpt4apiHack.webView.send('html-get-last', json)
}
)
// Cancel the timeout
ipcRenderer.on('html-delta-text', (event,json)=>{
    if (gpt4apiHack.message) {
        log('html-delta-text index')
        gpt4apiHack.message.content = json.data
        if (gpt4apiHack.container) {
            gpt4apiHack.container.innerText = json.data
            gpt4apiHack.container.scrollTop = gpt4apiHack.container.scrollHeight
        }
        gpt4apiHack.startTimer()
    } else {
        ipcRenderer.send('external-request-gpt-api-hack-main', json.data)
    }

}
);
const synth = window.speechSynthesis

ipcRenderer.on('html-get-last', (event,last)=>{
    let message = gpt4apiHack.message
    if (message) {
        // Send input data to the renderer process
        log('get last in index.js ')
        if (last.indexOf('ChatGPT') == 0) {
            last = last.substring('ChatGPT'.length + 1)
        }
        message.content = last
        if (gpt4apiHack.container) {
            gpt4apiHack.container.innerText = '[CLEARED]'
        }
        gpt4apiHack.message.send()
    } else {
        // if (last.indexOf('ChatGPT') == 0) {
        //     last = last.substring('ChatGPT'.length + 1)
        // }
        // Assuming you have the HTML stored in a variable called 'htmlString'
        
        // Create a temporary element
        let tempElement = document.createElement('div');
        
        // Set the HTML content of the temporary element
        tempElement.innerHTML = last;
        
        // Get the inner text
        let innerText = tempElement.innerText;
        innerText = innerText.substring('ChatGPTChatGPT'.length,innerText.length-5)
        // Output the inner text
        console.log(innerText);
        tempElement.remove()
        ipcRenderer.send('html-get-last-http-request', innerText)
    }
}
);

let gpt4apiHack = new Gpt4apiHack()
