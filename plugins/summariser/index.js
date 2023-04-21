class Summariser extends OpenAssistant {
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
    
}

new Summariser()
