class Summariser extends Plugin {
    constructor(arg) {
        super(arg)
    }

    config() {
        return {
            name: 'Summariser',
            id: 'sum',
            description: 'Summariser',
            role: 'worker',
            active: false,
            url: "https://open-assistant.io"
        }
    }
    
    exec(message){
        return "please summarise : " + message.content
    }
}

new Summariser()
