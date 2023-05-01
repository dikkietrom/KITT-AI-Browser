class Whisper extends Plugin {
    constructor(arg) {
        super(arg)
    }

    config() {
        return {
            name: 'Whisper API',
            role: 'sst',
            active: true,
            id: 'wsp',
            description: 'Whisper API'
        }
    }

    exec(message) {
        return 'Whisper got : ' + message.content
    }
}
new Whisper()




ipcRenderer.on('mic-reply', (event,mes)=>{

    log('mic-reply : ', mes)
}
)
ipcRenderer.on('stt-reply', (event,mes)=>{

    if (but) {
        but.innerHTML = 'rec'
        but.recstate = null
    }



    currentInp.value += mes
    run()

}
)
let but
function rec(button) {
    if (button.recstate == 'rec') {

        button.innerHTML = '&nbsp;&nbsp;&nbsp;'
        ipcRenderer.send('mic-stop');
        button.recstate = 'wait'
        return
    } else if (button.recstate == 'wait') {
        return
    }


    but = button
    button.recstate = 'rec'
    button.innerHTML = '...'

    ipcRenderer.send('mic');
}
