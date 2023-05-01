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
            active: true,
            url: "../plugins/coder/index.html"
        }
    }

    exec(message) {
        let that = this
        try {
             let code = codeBlock({
                  content: message.content
              })
            if (code.code) {
                 doInPreload({
                     plugin: that,
                        js:'document.body.innerHTML+="<pre>code</pre>"'
//                      js:
//`
// let code = ${code}
// let functionName = code.trim().substring("function ".length,code.indexOf(' ',1) ))
// document.body.innerHTML = 'functionName ' + code
// `
                 })
                //eval(code)
                message.content =  "It works!"
            } else if(!code.error){
                message.content =  "No code found, did you define language?"
            } else if(code.error){
                message.content =  code.error
            }
        } catch (error) {
            err(error)
            message.content =  '[ERROR] : ' + error.message + ' : ' + error.stack
            
        }
        return message.content
    }
}
function codeBlock(json) {

     get.parser.innerHTML = json.content
     let element = get.parser.children[get.parser.children.length - 1]
     get.parser.removeChild(element)
     let code = element.getElementsByTagName('pre')
     if (code.length > 1) {
         return {error:'One code block per reply please.'}
     }
     code = code[0]
     if (!code) {
         return {error: 'No code block found, please supply code block.'}
     }
    return { code: code.children[0].children[1].innerText}

}

new Coder()
