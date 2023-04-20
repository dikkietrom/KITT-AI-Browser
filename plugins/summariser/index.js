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
            active: true,
        }
    }
    exec(message) {
        return `sum result : ${message.content}  `

    }
}

new Summariser()
