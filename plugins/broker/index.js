class Broker extends Plugin {
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
            name: 'Broker',
            id: 'broker',
            description: 'The message broker',
            role: 'broker',
            active: true,
        }
    }

    exec(message) {
        try {
            if (!message.to.length) {
                throw new Error('Message has no receiver')
            }
            let pluginTo = message.to[0]
            if (!pluginTo) {
                throw new Error('Message has no receiver')
            }
            message.content = pluginTo.exec(message)
            //next to?
            if (message.to.length > 1) {
                message.to.shift()
                message.send()
            } else {
                message.to = [message.from]
                message.from = pluginTo
                pluginReply(message)
            }

        } catch (error) {
            err(error)
            message.to = [message.from]
            message.content = error.message
            message.from = this
            pluginReply(message)
        }
    }
}
class Message {
    constructor(arg) {
        this.id = generateUniqueId()
        this.to = []
        this.from = null
        this.content = null
    }
    send() {
        broker.exec(this)
    }
}

const generateUniqueId = ()=>{
    const randomString = Math.random().toString(36).substring(2, 8);
    const timestamp = Date.now().toString(36);
    return `${randomString}-${timestamp}`;
}

var broker = new Broker()
