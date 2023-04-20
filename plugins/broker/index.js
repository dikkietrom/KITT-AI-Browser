class Broker extends Plugin {
    constructor(arg) {
        super(arg)
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
                message.to = [message.from]
                message.from = message.chain[message.chain.length - 1]
                pluginReply(message)
                newInp()
                return
            }
            let screenMessage = message.to.shift().exec(message)
            message.content = screenMessage
            pluginReply(message)
            if (!message.to.length) {
                 newInp()
            }else{
                message.send()
            }

        } catch (error) {
            err(error)
            message.to = [message.from]
            message.content = error.message
            message.from = this
            pluginReply(message)
            newInp()
        }
    }
}
class Message {
    constructor(arg) {
        this.id = generateUniqueId()
        this.to = []
        this.chain = []
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
