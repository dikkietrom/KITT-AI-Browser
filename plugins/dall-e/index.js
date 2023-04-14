class Dalle extends Plugin {
    constructor(arg) {
        super(arg)
        this.conversation = ''
    }
    listen(message, container) {

       
        for(let i = 0;i<message.data.length  ; i++){
            let img = new Image()
            img.id = Date.now()
            img.src=message.data[i].url
            container.appendChild(text(img.id))
            container.appendChild(img)

         } 
    }
    speak() {

       ipcRenderer.send('plugin-dall-e', this.conversation + ' ' + currentInp.value);
    }
    config() {
        return {
            name: 'Dall-e API',
            role: 'worker',
            skill: 'tti',
            description: 'Dall-e API'

        }
    }
}
new Dalle() 
