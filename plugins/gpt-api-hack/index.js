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
            active: false,
            icon: 'icon.png',
            url: "https://chat.openai.com/"
        }
    }
    exec(message) {
        this.webView.send('send-input', message.content)
    }
    onData(json) {// console.log(json)
    }
    onReplied(container) {
        if (container.children[0]) {
        //  let child = container.children[0].children[0].children[1].children[0].children[0]

        //  container.removeChild(container.children[0])
        //  container.appendChild(child)

        }
    }
}

// Cancel the timeout
ipcRenderer.on('html-delta-text', (event,json)=>{
    if (gpt4apiHack.message) {
        log('html-delta-text index')
        gpt4apiHack.message.content = json.data
        if (gpt4apiHack.container) {
            gpt4apiHack.container.innerText = json.data
            gpt4apiHack.container.scrollTop = gpt4apiHack.container.scrollHeight
        }
    }
    gpt4apiHack.startTimer()
}
);
const synth = window.speechSynthesis

ipcRenderer.on('html-get-last', (event,last)=>{
    let message = gpt4apiHack.message
    if (message) {
        // Send input data to the renderer process
        log('get last in index.js ' )
        if (last.indexOf('ChatGPT') == 0) {
            last = last.substring('ChatGPT'.length + 1)
        }
        message.content = last
        if (gpt4apiHack.container) {
            gpt4apiHack.container.innerText = '[CLEARED]'
        }

        // const utterThis = new SpeechSynthesisUtterance(gpt4apiHack.message.content)
        // utterThis.lang = 'nl-NL'
        // utterThis.pitch = 1
        // utterThis.rate = 0.8
        // synth.speak(utterThis)
        // let voices = synth.getVoices()
        // voices.forEach((voice)=>{
        //     if (voice.lang == 'nl-NL') {
        //       //  console.error(voice.name)
        //     }
        // }
        // )
        gpt4apiHack.message.send()
    }
}
);

let gpt4apiHack = new Gpt4apiHack()
