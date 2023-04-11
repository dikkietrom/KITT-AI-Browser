const {ipcMain} = require('electron');
const {spawn} = require('child_process');
const fs = require('fs');

let log

function init(lg) {
    log = lg

}
ipcMain.on('tts', async(event,arg)=>{

    console.log('tts', arg);
    speak(arg.txt,arg.voice)
}
)




ipcMain.on('tts-kitt', async(event,voice)=>{

    console.log('tts-kitt', voice);
    if(voice=='alice'){
        elevenSpeak(kittTxt,'HgdftKHCCUuR9NqHQess')

    }
}
)

const preTxt = 'Hi alice can you please speak out the following answer to something for me'
const kittTxt = 'Hi alice can you please answer'
 async function speak(txt,voice) {
    try {
    if(voice=='alice'){
        console.log('tts-main : voice alice')

        //log.webContents.send('did-tts',  `${preTxt}: ${txt}`)

    }else{
        elevenSpeak(txt,voice)
    }

    } catch (err) {
        console.error('Error start tts server:', err);
        log(err)
    }
}
function elevenSpeak(txt,voice){
        // Spawn a child process and execute the Python script
        const pythonProcess = spawn('python3', ['speak.py',txt,voice]);
        // Log any errors from the Python script
        pythonProcess.stderr.on('error', (data)=>{
            let m = `stderr tts: ${data}`
            console.error(m);
        }
        );
        pythonProcess.stdout.on('data', (data) => {
            let message = `speak.py: ${data}`
            let str = new String(data)
            console.log(message);
            log(message)
            //log.webContents.send( 'tts-d-id-stream', message)
        });

        // Handle the exit event of the Python script
        pythonProcess.on('close', (code)=>{
            let m = `tts process exited with code ${code}`
            console.log(m);

        }
        );
}

module.exports = init
