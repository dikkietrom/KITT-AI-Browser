class User extends Plugin {
    constructor(arg) {
        super(arg)
     }

    config() {
        return {
            name: 'Me',
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
