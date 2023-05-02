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
        let error=false
        try {
             let code = codeBlock({
                  content: message.content
              })
              log('code', code.code)
            if (code.error) {
                error=true
            }
           writeFileSync({loc:'plugins/coder/code.js',data:code.code})

            if (code.code) {
                setTimeout(()=>{
                    doInPreload({
                         plugin: that,
                           js:'location="index.html?"+Date.now()'
     
                     })
                    }, 2000)
                eval(code.code)
                message.content =  "It works!"
            } else if(!code.error){
                error = true
                message.content =  "No code found, did you define language?"
            } else if(code.error){
                error = true
                message.content =  code.error
            }
        } catch (aerror) {
            err(error)
            error = true
            message.content =  '[ERROR] : ' + aerror.message + ' : ' + aerror.stack
            
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
function writeFileSync(json) {
    json.imp= `../plugins/file/main.js`
    json.func= `writeFileSync`
    return ipcRenderer.sendSync('doInMain', json)
}

function codeBlock(json) {

     get.parser.innerHTML = json.content
     let element = get.parser.children[get.parser.children.length - 1]
     get.parser.removeChild(element)
     let code = element.getElementsByTagName('pre')
     let codes = []
     for (let i = 0; i < code.length; i++) {
            codes.push(code[i].children[0].children[1].innerText)
     }

     if (!code) {
         return {error: 'No code block found, please supply code block.'}
     }
    return { code: codes.join('\n') }

}

new Coder()
