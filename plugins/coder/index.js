class Coder extends Plugin {
    constructor(arg) {
        super(arg)
    }

    config() {
        return {
            name: 'Coder',
            id: 'code',
            description: 'Code',
            role: 'worker',
            active: false,
            url: "../plugins/coder/index.html"
        }
    }

    exec(message) {
        let that = this
        let error = false
        try {
            let code = codeBlock({
                content: message.content,
                message: message
            })
            log('code', code.code)
            if (code.error) {
                error = true
            }
            writeFileSync({
                path: 'plugins/coder/code.js',
                data: code.code
            })

            if (code.code) {
                setTimeout(()=>{
                    doInPreload({
                        plugin: that,
                        js: 'location="index.html?"+Date.now()'

                    })
                }
                , 2000)
                eval(code.code)
                message.content = "It works!"
            } else if (!code.error) {
                error = true
                message.content = "No code found, did you define language?"
            } else if (code.error) {
                error = true
                message.content = code.error
            }
        } catch (error) {
            err(error)
            error = true
            message.content = '[ERROR] : ' + aerror.message + ' : ' + aerror.stack

        }
        //        if(error){
        //            let ins = []
        //            ins.push(this)
        //            ins.push(message.to[0])
        //            let chainIns = message.chain.length - 1 - message.to.length
        //            message.chain.insert(chainIns,ins)
        //            message.to.insert(1,ins)
        //
        //        }
        return message.content
    }
}

function codeBlock(json) {
    let pos = json.message.chain.length - 1 - json.message.to.length

    if (pos < 0 || json.message.chain[pos] == Plugin.user) {
        return {
            code: json.content
        }
    }
    get.parser.innerHTML = json.content
    let element = get.parser.children[get.parser.children.length - 1]
    get.parser.removeChild(element)
    let code = element.getElementsByTagName('pre')
    let codes = []
    for (let i = 0; i < code.length; i++) {
        codes.push(code[i].children[0].children[1].innerText)
    }

    if (!code) {
        return {
            error: 'No code block found, please supply code block.'
        }
    }
    return {
        code: codes.join('\n')
    }

}

new Coder()
