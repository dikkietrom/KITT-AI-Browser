class OpenAssistant extends Plugin {
    constructor(arg) {
        super(arg)
     }
 
    config() {
        return {
            name: 'OpenAssistant',
            id:'oa',
            description: 'OpenAssistant',
            role: 'manager',
            active:false,
            url: "https://open-assistant.io"
        }
    }
    onBeforeSendHeaders(json) {
        log(json)
    }
    exec(message){
         
    }
}


new OpenAssistant()
