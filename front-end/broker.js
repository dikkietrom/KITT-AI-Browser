class Broker {
    send(message) {

        try {
            if (!message.to.length) {
                throw new Error('Message has no receiver')
            }
            let to = message.to[0]
            if (!to) {
                throw new Error('Message has no receiver')
            }

            
            let plugin = pluginById[to]
            if (plugin) {
                message.content = plugin.exec(message)
                //remove first
                let last = message.to.shift()
                //next to?
                if (message.to.length) {
                    message.send()
                } else {
                    //end result to sender
                    message.to=[message.from]
                    message.from= last.id
                    message.send()
                }

            } else {
               throw new Error('[UNDELIVERABLE:unknown pluginId : ' + message.to[0] + ']')
            }
        } catch (error) {
            message.to=[message.from]
            message.content = error.message
            message.from='broker'
            message.send()
        }

    }

}
class Message {
    constructor(arg) {
        this.to = []
        this.from = null
        this.content = null
    }
    send(){
        broker.send(this)
    }
}
var broker = new Broker()
