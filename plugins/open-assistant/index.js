class OpenAssistant extends Plugin {
    constructor(arg) {
        super(arg)
     }
 
    config() {
        return {
            name: 'OpenAssistant',
            description: 'OpenAssistant',
            role: 'manager',
            url: "https://open-assistant.io"
        }
    }
}


new OpenAssistant()
