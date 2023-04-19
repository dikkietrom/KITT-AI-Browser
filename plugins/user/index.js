class User extends Plugin {
    constructor(arg) {
        super(arg)
        this.conversation = ''
    }
    listen(message, _container) {
        _container.innerText = message.content

    }
    speak(message) {
        pluginReply(message)
    }
    config() {
        return {
            name: 'User',
            id: 'user',
            description: 'you',
            role: 'user',
            active: true,
        }
    }
    exec(message) {
        return message.content
    }
}

new User()
