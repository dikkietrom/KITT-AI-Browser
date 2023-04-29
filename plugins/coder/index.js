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
            active: true
        }
    }

    exec(message) {
        try {
            let code = codeBlock({
                content: message.content
            })
            if (code) {
                eval(code)
                return "It works!"
            } else {
                return "No code found, did you define language?"
            }

        } catch (e) {
            err(e)
            return '[ERROR] : ' + e.message
        }

    }
}
function codeBlock(json) {

    let code = ''
    let ret = ''
    let count = 0
    let language = ''
    with (json) {
        let index = content.indexOf('```')

        while (index != -1) {
            if (count > 0) {
                throw new Error('Only once code block at the time please')
            }
            count++

            code = content.substring(index + 3, content.indexOf('```', index + 3))
            content = content.substring(0, index) + content.substring(content.indexOf('```', index + 3) + 3)
            index = content.indexOf('```')
            code = code.trim()

            language = code.substring(0, code.indexOf('\n'))
            if (!language) {
                language = code.substring(0, code.indexOf(' ')+1)
                if (language) {
                    language = language.trim()
                }

            }
            code = code.substring(language.length)

            if (language && language != 'javascipt' && language != 'js' && language != 'bash') {
                throw new Error(`cannot directly execute "${language}". Include writing the language on line one,
                    options are js,javascript,bash`)
            } else if (!language) {
                throw new Error(`Firt line of code block does not specify the language. Include writing the language one line one,
                    options are js,javascript,bash`)
            }
        }
    }
    return code

}

new Coder()
