const {ipcMain} = require('electron');
const {spawn} = require('child_process');
const fs = require('fs');
const {apiKeys,promptIt} = require("../back-end/keys.js")

let log
let apiKey
async function init(lg) {
    log = lg
    
    apiKey = apiKeys('elevenlabs')
    console.log('tts-main init api ',apiKey);

    if (!apiKey) {
        console.log('tts-main init no api key');
        apiKey = await promptIt('Elevenlabs API (not mandatory)', 'elevenlabs')
        if (apiKey) {
            console.log('tts-main got key', apiKey);

        } else {
            console.log('no tts-main  key', apiKey);

            return
        }
    }
}
ipcMain.on('tts', async(event,arg)=>{

    console.log('tts', arg);
    speak(arg.txt, arg.voice)
}
)

ipcMain.on('tts-kitt', async(event,voice)=>{

    console.log('tts-kitt', voice);
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
            console.log('tts-main : voice alice')

            //log.webContents.send('did-tts',  `${preTxt}: ${txt}`)

        } else {
            elevenSpeak(txt, voice)
        }

    } catch (err) {
        console.error('Error start tts :', err);
        log(err)
    }
}


function elevenSpeak(txt, voice) {
     console.log(  'elevenSpeak')
    // Spawn a child process and execute the Python script
    const pythonProcess = spawn('python3', ['tts/speak.py', txt, voice, apiKey ])
    // Log any errors from the Python script
    console.log(  'speak.py out',  pythonProcess.stdout.toString())
    console.log(  'speak.py err',  pythonProcess.stderr.toString())
    pythonProcess.stdout.on('end', (data)=>{
        let m = `stdout speak: ${data}`
        console.log(m,data);
       // log(m)
    })
    pythonProcess.stderr.on('end', (data)=>{
        let m = `stderr speak: ${data}`
        console.log(m,data);
       // log(m)
    })

}

module.exports = init
