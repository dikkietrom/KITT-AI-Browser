class File extends Plugin {
    constructor(arg) {
        super(arg)
    }

    config() {
        return {
            name: 'File',
            id: 'file',
            description: 'File',
            role: 'worker',
            active: true,
        }
    }

    exec(message) {
        return "got File  : " + message.content
    }
}

new File()