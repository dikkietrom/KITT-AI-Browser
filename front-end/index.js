let currentInp
let replyLen = 0
init.cnt = 0
let plugByUrl = {}

function init() {
    document.getElementById('inp').focus()
    if (!currentInp) {
        currentInp = document.getElementById('inp')
    }

    const randomNum = Math.random();
    log('randomNum', randomNum);

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
    //request plugin
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
        currentInp.value = `you are ceo of a company that is run by an ai board, ai managers and ai workers. I am only messagebroker. The customer is a GP that wants to have an online digital clone available for the patient to act as an assistant to do the intake and prepare the GP work. You make it happen. Direct you message always to the customer or the other ai's. The workers execute external services. We have a google worker, dall-e worker, gpt api worker. All ai's are instances of yourself and you train them for their task and update the plugin files. There is also a code execution service, you can request code executions through the broker and get result from the broker so if you need info from the file system you can do it like that. All ai's and external services are plugins. When we need a new service then you write the plugin and train the worker for it's task. First task is make a website. Start with execution. You can send multiple message at once, so give as many instructions to as many ai's as possible. I am available for advice. Always start your message with the name of the receiver and a colon. Eg google-service : get latest info about technology. The reply you get is the same so you know where it is coming from. Think about a good name for the product we will make for the customer. The name of the customer is JD Beugelaar. My name is Dennis. Always speak to the broker otherwise I cannot hear you ok? The broker is an imaginary concept, I act as broker by copy and pasting your messages. You are the CEO, I am the broker but also your advisor. So when you need advice then speak to the broker, like you do with everybody else ok. That means that you don't explain anything, no comments. Only messages that start with receiver name , then a colon and then the message. So when you reply and want to say something to me then start with "dennis : " and then what you want to say ok?`
    } else if (!sel.value) {
        currentInp.value = ``
        return
    }
    plugin()

}
function textInputListener(input, event) {
    try {
        if (event.key === 'Enter') {
            plugin()
            event.preventDefault();
            return false
        }
    } catch (error) {
        log(textInputListener.constructor.name, error)
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
        webview.style.height = '0px'
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
    let element = document.createElement(tag)
    if (parent.tagName) {
        parent.appendChild(element)
    } else if (parent) {
        get(parent).appendChild(element)
    }
    return element

}
function div(parent) {
    return element(parent, 'div')
}

function span(parent) {
    return element(parent, 'span')
}