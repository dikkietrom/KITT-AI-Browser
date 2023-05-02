function log() {
    try {
        let argumentsArr = Array.from(arguments)



        get('console-view-parent').classList.add('console-view-fade')
        let depth = 2
        if (argumentsArr[0] && argumentsArr[0][0] instanceof Error) {
            console.error(argumentsArr[0][0])
            depth++
        }
        if(argumentsArr[0] && (!argumentsArr[0].charAt || argumentsArr[0].charAt(0)!='[')){
            console.log('[FRONT-END]',logInfo(depth), argumentsArr.join())
        }else{
            console.log(logInfo(depth), argumentsArr.join())
        }


        addLog({
            messages: argumentsArr,
            depth: depth + 1
        })
    } catch (error) {
        console.error(error)
        for (let i = 0; i < argumentsArr.length; i++) {
            console.error(argumentsArr[i])
        }

    }

}

function addLog(arg) {
    let messages = arg.messages
    let depth = arg.depth
    let consoleView = get('console-view')
    let line = div()
    consoleView.insertBefore(line, consoleView.children[0])
    line.onclick = function() {
        if (line.classList.contains('log-line-open')) {
            line.classList.remove('log-line-open')
            return
        }
        line.classList.add('log-line-open')
    }
    line.className = 'log-line'

    messages = Array.from(messages);
    if (messages[0] && messages[0][0]instanceof Error) {
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
