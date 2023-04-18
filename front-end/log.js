function log() {
    let depth = 2

    console.log(logInfo(depth), Array.from(arguments).join())
    if (arguments[0] instanceof Error) {
        console.error(arguments[0])
    }
    addLog({messages:arguments,depth:depth+1})

}

function addLog(arg) {
    let messages = arg.messages
    let depth = arg.depth
    let line = div('console-view')
    line.onclick=function () {
        if (line.classList.contains('log-line-open')) {
            line.classList.remove('log-line-open')
            return
        }
        line.classList.add('log-line-open')
    }
    line.className = 'log-line'

    messages = Array.from(messages);
    if (messages[1] && messages[1] instanceof Error ) {
        line.className = 'log-line log-error'
        console.error(messages[1])
    }    
    if (depth) {
        messages.unshift(logInfo(depth))
    }
    messages.forEach((message)=>{
        let s = span(line)
     
        s.className = 'log-word'
        s.innerHTML = message ? message : '[EMPTY/NULL]'
        if (message == messages[0]) {
            s.className = 'log-info'
        }
    }
    )

}
