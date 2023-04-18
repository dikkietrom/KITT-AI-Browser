const {ipcMain} = require('electron');
const {spawn} = require('child_process');
const fs = require('fs');
const path = require('path');
const {apiKeys,promptIt} = require("../back-end/keys.js")
const {log,err} = require(path.join(__dirname, '..','lib/shared.js'));

 let apiKey
async function init() {

    apiKey = apiKeys('elevenlabs')
    log('tts-main init api ',apiKey);

    if (!apiKey) {
        log('tts-main init no api key');
        apiKey = await promptIt('Elevenlabs API (not mandatory)', 'elevenlabs')
        if (apiKey) {
            log('tts-main got key', apiKey);

        } else {
            log('no tts-main  key', apiKey);

            return
        }
    }
}
ipcMain.on('tts', async(event,arg)=>{

    log('tts', arg);
    speak(arg.txt, arg.voice)
}
)

ipcMain.on('tts-kitt', async(event,voice)=>{

    log('tts-kitt', voice);
    if (voice == 'alice') {
        elevenSpeak(kittTxt, 'HgdftKHCCUuR9NqHQess')

    }
}
)

const preTxt = 'Hi alice can you please speak out the following answer to something for me'
const kittTxt = 'Hi alice can you please answer'
async function speak(txt, voice) {
    try {
        if (voice == 'alice') {
            log('tts-main : voice alice')

            //log.webContents.send('did-tts',  `${preTxt}: ${txt}`)

        } else {
            elevenSpeak(txt, voice)
        }

    } catch (e) {
        e.message = 'Error start tts :' + e.message
        err(e);
    }
}


function elevenSpeak(txt, voice) {
     log(  'elevenSpeak')
    // Spawn a child process and execute the Python script
    const pythonProcess = spawn('python3', ['tts/speak.py', txt, voice, apiKey ])
    // Log any errors from the Python script
    log(  'speak.py out',  pythonProcess.stdout.toString())
    log(  'speak.py err',  pythonProcess.stderr.toString())
    pythonProcess.stdout.on('end', (data)=>{
        let m = `stdout speak: ${data}`
        log(m,data);
       // log(m)
    })
    pythonProcess.stderr.on('end', (data)=>{
        let m = `stderr speak: ${data}`
        log(m,data);
       // log(m)
    })

}

module.exports = init
