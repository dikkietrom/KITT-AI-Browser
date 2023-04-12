ipcRenderer.on('stts-main-reply', (event,stts)=>{

    let sttImpl = document.getElementById('stt-impl')

    for (let p in stts) {
        let s = stts[p]
        let option = document.createElement('option')
        sttImpl.appendChild(option)
        option.innerHTML = p
        option.chatImpl = s
    }
    event.sender.send('stt-impl', sttImpl[sttImpl.selectedIndex].value);
}
);
ipcRenderer.on('mic-reply', (event,mes)=>{

    console.log('mic-reply : ', mes)
}
)
ipcRenderer.on('stt-reply', (event,mes)=>{

    if (but) {
        but.innerHTML = 'rec'
        but.recstate = null
    }



    currentInp.value += mes
    chat()

}
)
let but
function rec(button) {
    if (button.recstate == 'rec') {

        button.innerHTML = '&nbsp;&nbsp;&nbsp;'
        ipcRenderer.send('mic-stop');
        button.recstate = 'wait'
        return
    } else if (button.recstate == 'wait') {
        return
    }


    but = button
    button.recstate = 'rec'
    button.innerHTML = '...'

    ipcRenderer.send('mic');
}
