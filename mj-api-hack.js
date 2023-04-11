class MjApiHack extends Chat {
    constructor(arg) {
        super(arg)
        this.conversation = ''
    }
    listen(message, _container) {

        container = _container
    }
    speak() {

        try {
            console.log('mj-api-hack',currentInp.value)
            
            currentInput = currentInp.value.trim()
            mjView.send('send-input', currentInput)
            chatReply('')

        } catch (error) {
            let m = `mj-api-hack Error: ${error.message}`

            console.log(m)
        }
    }
}

ipcRenderer.on('chat-mj-api-hack-reply', (event,arg)=>{

  
}
);

new MjApiHack()
