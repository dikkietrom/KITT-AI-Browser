class Bash extends Plugin {
    constructor(arg) {
        super(arg)
    }

    config() {
        return {
            name: 'Bash',
            description: 'Bash',
            id:'bsh',
            role: 'worker',
            active: true
        }
    } 
     exec(message){
        let code = codeBlock({
            content: message.content
        })
        return execBash({data:code.code})
     }
}

function execBash(json) {
    return doInMain(arguments, 'bash')
}

new Bash()


