
function log() {
     
    
    console.log(logInfo(2),Array.from(arguments).join())
   // addLog(div('console-view'), arguments,3)

}

function addLog(div, messages,depth) {

    messages = Array.from(messages);
    if (depth) {
        messages.unshift(logInfo(depth))
    }
    messages.forEach((message)=>{
        let s = span(div)
        s.className = 'log-word'
        s.innerHTML = message
        if (message == messages[0]) {
            s.className = 'log-info'
        }
    }
    )

}