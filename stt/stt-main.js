const {ipcMain} = require('electron');
const fs = require('fs');
const {spawn} = require('child_process');
const net = require('net');
const path = require('path');

const mic = require('mic');
const wav = require('wav');
const {log,err} = require(path.join(__dirname, '..','lib/shared.js'));

const sttsMain = {}

const IP = '127.0.0.1';
const PORT = 12346;

function init(lg) {

    log('stt-main init')
    ipcMain.on('mic', async(event)=>{
        const outputPath = 'stt/stt-mic-output.wav';

        try {
            rec = true
            await recordMicAudioToWav(outputPath);
            log('WAV file successfully written.');
            event.sender.send('mic-reply', {
                message: 'WAV file successfully written.'
            });

           

        } catch (e) {
            e.message = 'Error writing WAV file: ' + e.message;
            err( e);

            event.sender.send('mic-reply', e);
        }
        try {

            sttImpl.transcribe(event)           

        } catch (e) {
            e.message = 'Error transcribe  : ' + e.message;
            err('Error transcribe :', e);
            event.sender.send('mic-reply', e);
        }
        
    }
    );
    ipcMain.on('mic-stop', async(event)=>{

        try {
            rec = false
            event.sender.send('mic-stop-reply','rec stopped');
        } catch (e) {
            e.message = 'Error mic-stop : ' + e.message;
            err(e);
            event.sender.send('mic-stop-reply', e);
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
        log('pyt', pyt)
        // Spawn a child process and execute the Python script
        const pythonProcess = spawn('python3', [ pyt ]);

        // Log the output from the Python script
        pythonProcess.stdout.on('data', (data)=>{
            log('main whisper data', str)
            log(m)
        }
        );
        pythonProcess.stdout.on('connect', (data)=>{
            log('main whisper up', str)
            log(m)
        }
        );

        // Log any errors from the Python script
        pythonProcess.stderr.on('error', (data)=>{
            let m = `stderr whisper: ${data}`
            err(m);
            log(m)
        }
        );

        // Handle the exit event of the Python script
        pythonProcess.on('close', (code)=>{
            let m = `whisper process exited with code ${code}`
            log(m);
            log(m)
        }
        );

     } catch (e) {
        err( e);
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
                log(m);
                log(m)
            }
            )
            // Receive data from the server
            client.on('data', (data)=>{
                event.sender.send('stt-reply', new String(data))
                let m = `Received from whisper server: ${data}`
                log(m);
                log(m)
                // Close the connection
                client.end();
            }
            );

            // Print a message when the connection is closed
            client.on('end', ()=>{
                let m = 'Disconnected from whisper server'
                log(m);
                log(m)
            }
            );

            // Print a message in case of an error
            client.on('error', (error)=>{
                let m = `whisper Error: ${error.message}`
                err(m);
                event.sender.send('stt-reply', `whisper Error: ${error.message}`)
                log(m)

            }
            );

            client.write('sst-request');

        } catch (error) {
            error.message = `wisper outer catch Error: ${error.message}`
            event.sender.send('stt-reply', error.message)
            err(error)
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
