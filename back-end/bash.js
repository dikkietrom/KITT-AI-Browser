//execute a bash command and return the result syncronised nodeje
const {ipcMain} = require('electron');
const fs = require('fs');
const {spawn} = require('child_process');

function init(lg) {
    console.log('bash init')
    log = lg

    ipcMain.on('bash', (event,arg)=>{
        console.log('bash ipcMain',arg)
        //execute a bash command and return the result syncronised nodeje
        const bash = spawn('bash', ['-c', arg]);
        bash.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            event.sender.send('bash-reply', new String(data));
        }
        );
        bash.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
            event.sender.send('bash-reply', new String(data));
        })
        
    })

}

module.exports = init

