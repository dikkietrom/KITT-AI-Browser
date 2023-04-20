function log() {
    let depth = 2
    if (arguments[0] && arguments[0][0]instanceof Error) {
        console.error(arguments[0][0])
        depth++
    }
    console.log(logInfo(depth), Array.from(arguments).join())

    addLog({
        messages: arguments,
        depth: depth + 1
    })

}

function addLog(arg) {
    let messages = arg.messages
    let depth = arg.depth
    let consoleView = get('console-view')
    let line = div(consoleView)
    line.onclick = function() {
        if (line.classList.contains('log-line-open')) {
            line.classList.remove('log-line-open')
            return
        }
        line.classList.add('log-line-open')
    }
    line.className = 'log-line'

    messages = Array.from(messages);
    if (messages[0] && messages[0][0] instanceof Error) {
        line.className = 'log-line log-error'
        messages = Array.from(messages[0])
        messages.push(messages[0].stack)
    }
    if (depth) {
        messages.unshift(logInfo(depth))
    }
    messages.forEach((message)=>{
        let s = span(line)
        s.className = 'log-word'
        s.innerText = message ? message : '[EMPTY/NULL]'
        if (message == messages[0]) {
            s.className = 'log-info'
        }
    }
    )
    consoleView.scrollTop = consoleView.scrollHeight

}
