class GptEdit extends Chat {
    constructor(arg) {
        super(arg)
        this.conversation = ''
    }
    listen(message, container) {    

        container.innerHTML += message.error?message.error.message: message.choices[0].text
    }
    speak() {   
        
        try {
            let arg = {}
            let inpStr = currentInp.value
            arg.txt =  inpStr.substring(0,inpStr.lastIndexOf(':')) 
            arg.instruction = inpStr.substring(inpStr.lastIndexOf(':')+1)
            arg.model = selVal('models')
            ipcRenderer.send('chat-gpt-edit',  arg);

        } catch (error) {
            let m = `gpt-edit Error: ${error.message}`
             
            console.log(m) 
        }
    }

}
 
new GptEdit()
