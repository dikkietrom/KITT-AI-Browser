class Summariser extends Plugin {
    constructor(arg) {
        super(arg)
        this.conversation = ''
    }
    listen(message, _container) {}
    speak(message) {
        pluginReply(message)
    }
    config() {
        return {
            name: 'Summariser',
            id: 'sum',
            description: 'Summariser',
            role: 'worker',
            active: true,
        }
    }
    exec(message) {
        return `search result : ${message.content}  `

    }
}

new Summariser()
