let currentInp
let replyLen = 0
init.cnt = 0
let plugByUrl = {}

function init() {

    let recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = function(event) {
        if (event.results.length > 0) {
            log(even)
        }
    }
    recognition.start();
    document.getElementById('inp').focus() 
    if (!currentInp) {
        currentInp = document.getElementById('inp')
    }

    const randomNum = Math.random();

    if (randomNum > 0.5) {
        document.body.style.backgroundImage = "url('kitt-back.png')";
    } else {
        document.body.style.backgroundImage = "url('kitt.png')";

    }
    let startupAudio = new Audio('tune.mp3')
    startupAudio.currentTime = 1;

    startupAudio.play();

    ipcRenderer.send('stts-main')
    ipcRenderer.send('gpt-models')
    ipcRenderer.send('plugin-request')
}

function setPreset(sel) {
    if (sel.value == 'google') {
        currentInp.value = `when I start a question with the word "search" then reply with search() and in between the braces all words after the first word in between single quotes no comments, no explain. Wrap it in a javascript code block. Complete this based upon what I just explained

                            Me : search apples
                            You : `
    } else if (sel.value == 'bash') {
        currentInp.value = `a bash script that generates, compiles and runs a simple hello world c program, no comments, no explain, in a code block please`
    } else if (sel.value == 'ceo') {
        currentInp.value = `you are ceo of a company that is run by an ai board, 
                            ai managers and ai workers. The communication protocol is 
                            <sender>message<receiver>. When there is no sender the message is from me. You alway use the message protocol, my name is Michael, yours is KITT`
    } else if (!sel.value) {
        currentInp.value = ``
        return
    }
    run()

}
function textInputListener(input, event) {
    try {
        if (event.key === 'Enter') {
            run()
            event.preventDefault();
            return false
        }
    } catch (error) {
        err(error)
    }
}
function text(txt) {
    let pre = document.createElement('span')
    pre.innerHTML = txt
    return pre

}
function selVal(id) {
    let sel = document.getElementById(id)
    return sel[sel.selectedIndex].value
}

function toggleWebView(button, id) {
    let webview = document.getElementById(id)
    if (webview.showing) {
        webview.style.height = '1px'
        button.innerHTML = 'Show webview'

        webview.showing = false
    } else {
        webview.style.height = '400px'
        button.innerHTML = 'Hide webview'
        button.style.position = 'relative'

        webview.showing = true
    }
}
function debug(but) {
    if (but.state === 'r') {
        but.innerHTML = 'Debug'
        but.state = 'd'
        ipcRenderer.send('debug-stop')
        return
    }
    but.innerHTML = 'Run'
    but.state = 'r'
    ipcRenderer.send('debug')
}

function debugMain(but) {
    if (but.state === 'r') {
        but.innerHTML = 'Debug main'
        but.state = 'd'
        ipcRenderer.send('debug-main-stop')
        return
    }
    but.innerHTML = 'Run main'
    but.state = 'r'
    ipcRenderer.send('debug-main')
}
function toggleDevTools(but, id) {
    if (but.state === 'r') {
        but.innerHTML = 'Debug'
        but.state = 'd'
        document.getElementById(id).closeDevTools()
        return
    }
    but.innerHTML = 'Run'
    but.state = 'r'
    document.getElementById(id).openDevTools()
}

function showTab(index) {
    // Hide all tab content
    let tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }

    // Set the active tab
    let tabs = document.getElementsByClassName('tab');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }
    tabs[index].classList.add('active');

    // Show the selected tab content
    tabContents[index].classList.add('active');
}

function extractDomain(url) {
    const domainRegex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/?#\n]+)/;
    const matches = url.match(domainRegex);
    return matches && matches[1];
}
function insertElementAtIndex(parentElement, newElement, index) {
    if (index >= parentElement.children.length) {
        parentElement.appendChild(newElement);
    } else {
        parentElement.insertBefore(newElement, parentElement.children[index]);
    }
}

function get(id) {
    return document.getElementById(id)
}

function element(parent, tag) {
    try {
        let element = document.createElement(tag)
        if (parent.tagName) {
            parent.appendChild(element)
        } else if (parent) {
            get(parent).appendChild(element)
        }
        return element
    } catch (error) {
        err(error)
    }
}
function div(parent) {
    return element(parent, 'div')
}
function button(parent) {
    return element(parent, 'button')
}
function webview(parent) {
    return element(parent, 'webview')
}

function span(parent) {
    return element(parent, 'span')
}
function td(parent) {
    return element(parent, 'td')
}

function tr(parent) {
    return element(parent, 'tr')
}
