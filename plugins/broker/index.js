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
            //aync end
            if (!message.to.length) {
                pluginReply(message)
                newInp()
                return
            }
            let to = message.to[0]
            if (message.lockedBy) {
                pluginReply(message)
                message.lockedBy.message = null
                message.lockedBy = null
            }
            let screenMessage
            if (to.async) {
                screenMessage = `working on "${message.content}"`
                message.lockedBy = to
                message.lockedBy.message = message
            }
            let execMessage = to.exec(message)
            if (execMessage && to.async) {
                screenMessage = execMessage
            } else if(!to.async) {
                screenMessage = execMessage
            }

            message.content = screenMessage
            pluginReply(message)
            message.to.shift()
            //sync end
            if (!message.to.length && !to.async) {
                newInp()
            } else if (message.to.length && !to.async) {
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
