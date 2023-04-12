const {ipcMain} = require('electron');
const fs = require('fs');
const {spawn} = require('child_process');
const net = require('net');
const path = require('path');

const mic = require('mic');
const wav = require('wav');

const sttsMain = {}
let log

const IP = '127.0.0.1';
const PORT = 12346;

function init(lg) {
    console.log('stt-main init')
    log = lg
    ipcMain.on('mic', async(event)=>{
        const outputPath = 'stt/stt-mic-output.wav';

        try {
            rec = true
            await recordMicAudioToWav(outputPath);
            console.log('WAV file successfully written.');
            event.sender.send('mic-reply', {
                message: 'WAV file successfully written.'
            });

           

        } catch (err) {
            console.error('Error writing WAV file:', err);
            err.message = 'Error writing WAV file: ' + err.message;
            event.sender.send('mic-reply', err);
        }
        try {

            sttImpl.transcribe(event)           

        } catch (err) {
            console.error('Error transcribe :', err);
            err.message = 'Error transcribe  : ' + err.message;
            event.sender.send('mic-reply', err);
        }
        
    }
    );
    ipcMain.on('mic-stop', async(event)=>{

        try {
            rec = false
            event.sender.send('mic-stop-reply','rec stopped');
        } catch (err) {
            console.error('Error mic-stop :', err);
            err.message = 'Error mic-stop : ' + err.message;
            event.sender.send('mic-stop-reply', err);
        }
    }
    );
    ipcMain.on('stt-impl', async(event,impl)=>{
        sttImpl = sttsMain[impl]
    }
    );
    ipcMain.on('stts-main', async(event)=>{
        event.sender.send('stts-main-reply', sttsMain)
    }
    );


     try {
        let pyt = path.join(__dirname, 'whisper.py')
        console.log('pyt', pyt)
        // Spawn a child process and execute the Python script
        const pythonProcess = spawn('python3', [ pyt ]);

        // Log the output from the Python script
        pythonProcess.stdout.on('data', (data)=>{
            console.log('main whisper data', str)
            log(m)
        }
        );
        pythonProcess.stdout.on('connect', (data)=>{
            console.log('main whisper up', str)
            log(m)
        }
        );

        // Log any errors from the Python script
        pythonProcess.stderr.on('error', (data)=>{
            let m = `stderr whisper: ${data}`
            console.error(m);
            log(m)
        }
        );

        // Handle the exit event of the Python script
        pythonProcess.on('close', (code)=>{
            let m = `whisper process exited with code ${code}`
            console.log(m);
            log(m)
        }
        );

     } catch (err) {
        console.error('Error start whisper server:', err);
        //log(err)
     }


}
let sttImpl
let rec = false
// Update the 'recordMicAudioToWav' function to use the 'mic' package
function recordMicAudioToWav(outputPath) {
    return new Promise((resolve,reject)=>{
        const micInstance = mic({
            rate: '44100',
            channels: '1',
            debug: true,
            fileType: 'wav',
            exitOnSilence: 6,
        });
        const micInputStream = micInstance.getAudioStream();
        const outputStream = fs.createWriteStream(outputPath);

        micInputStream.pipe(outputStream);

        micInputStream.on('error', (err)=>{
            reject(err);
        }
        );

        micInputStream.on('end', ()=>{
            resolve();
        }
        );

        micInstance.start();
        waitStop(micInstance)    

    }
    );
}

function waitStop(micInstance){
        setTimeout(()=>{
            if (rec==false) {
                micInstance.stop();
            }else{
                waitStop(micInstance)
            }
        }
        , 100);    
}

class SttMain {
    constructor(arg) {
        sttsMain[this.constructor.name] = this
    }
    transcribe(event) {}
}

class WhisperMain extends SttMain {
    constructor(arg) {
        super(arg)
    }
    transcribe(event) {
        try {
            // Send a message to the server

            let client = net.createConnection({
                host: IP,
                port: PORT
            }, ()=>{
                let m = `Connected to whisper server at ${IP}:${PORT}`
                console.log(m);
                log(m)
            }
            )
            // Receive data from the server
            client.on('data', (data)=>{
                event.sender.send('stt-reply', new String(data))
                let m = `Received from whisper server: ${data}`
                console.log(m);
                log(m)
                // Close the connection
                client.end();
            }
            );

            // Print a message when the connection is closed
            client.on('end', ()=>{
                let m = 'Disconnected from whisper server'
                console.log(m);
                log(m)
            }
            );

            // Print a message in case of an error
            client.on('error', (error)=>{
                let m = `whisper Error: ${error.message}`
                console.error(m);
                event.sender.send('stt-reply', `whisper Error: ${error.message}`)
                log(m)

            }
            );

            client.write('sst-request');

        } catch (error) {
            let m = `wisper outer catch Error: ${error.message}`
            event.sender.send('stt-reply', m)
            log(m)
        }

    }
}
new WhisperMain()
class WhisperAPIMain extends SttMain {
    constructor(arg) {
        super(arg)
    }
    transcribe(event) {}
}
new WhisperAPIMain()



module.exports = init
