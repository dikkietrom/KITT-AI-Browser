let currentInp
let replyLen = 0
init.cnt = 0
let plugByUrl = {}
// Create an audio context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Load an audio file
const loadAudio = async (url) => {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer;
};

// Set the volume of an audio buffer source
const setVolume = (source, volume) => {
  const gainNode = audioContext.createGain();
  gainNode.gain.value = volume;
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);
};

// Play the audio
const playAudio = async (url, volume = 1) => {
  const audioBuffer = await loadAudio(url);
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  setVolume(source, volume);
  source.start(0);
};

function pathchIdGet(parent){  
  get[parent.id]=parent
  for(let child of parent.children){
    pathchIdGet(child)
  }
  
}

function init() {
    pathchIdGet(document.body)
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
    playAudio('tune.mp3', 0.1); // Play audio with a volume level of 0.5

    ipcRenderer.send('stts-main')
    ipcRenderer.send('gpt-models')
    ipcRenderer.send('plugin-request')
}
 
function textInputListener(input, event) {
    try {
        if (event.key === 'Enter' && ! event.shiftKey) {
            run()
            event.preventDefault();
            return false
        }
        if (event.key === '/' && (input.value.endsWith(' ') || input.value.endsWith('/') || !input.value )) {
            if(input.value.endsWith('/') ){
                input.value = input.value.substring(0,input.value.length-1)
            }
            input.value+=seperator
            event.preventDefault();
            //showPluginSelector(input)
            
            return false
        }
    } catch (error) {
        err(error)
    }
}

function showPluginSelector(input) {
    let pluginList = Object.values(pluginById).map(plugin => {
        return { name: plugin.constructor.name, value: plugin.config().id };
    });

    let popup = document.createElement('select');
    popup.classList.add('plugin-popup');
    popup.style.left = input.offsetLeft + 'px';
    popup.style.top = input.offsetTop + input.offsetHeight + 'px';
    popup.style.border = '1px solid #ccc';
    popup.style.background = '#fff';
    popup.style.zIndex = 1000;

    pluginList.forEach(plugin => {
        let pluginOption = document.createElement('option');
        pluginOption.classList.add('plugin-option');
        pluginOption.textContent = plugin.name;
        pluginOption.value = seperator + plugin.value;

        pluginOption.addEventListener('click', () => {
            input.value = pluginOption.value;
            popup.remove();
        });

        popup.appendChild(pluginOption);
    });

    document.body.appendChild(popup);

    // Remove the popup when clicking outside
    document.addEventListener('click', function removePopup(event) {
        if (!popup.contains(event.target)) {
            popup.remove();
            document.removeEventListener('click', removePopup);
        }
    });
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
function doInPreload(json){
    json.plugin.webView.send('doInPreload' , {from:json.plugin.config().name, js:json.js})
}
function doInMain(args, imp) {
    if (!args[0]) {
      args[0]={}
    }
    let json = args[0]
    json.imp = `../plugins/${imp}/main.js`
    json.func = arguments.callee.caller.name
    let r = ipcRenderer.sendSync('doInMain', json)
    return r
}
function get(id) {
    return document.getElementById(id)
}

function element(parent, tag) {
    try {
        let element = document.createElement(tag)
        if (parent && parent.tagName) {
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
function webview(parent) {
    if(parent){
        throw new Error('parent is not supported for webview, append it after configuration')
    }
    return element(null, 'webview')
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
function button(parent) {
    return element(parent, 'button')
}
function select(parent) {
    return element(parent, 'select')
}
function option(parent) {
    return element(parent, 'option')
}
