//execute a bash command and return the result syncronised nodeje
const {ipcMain} = require('electron');
const fs = require('fs');
const {spawnSync} = require('child_process');

function init(lg) {
    log = lg
    log('bash init')

    ipcMain.on('bash', (event,arg)=>{
        log('bash ipcMain',arg)
        //execute a bash command and return the result synchronised nodeje
        const bash = spawnSync('bash', ['-c', arg]);

        if (bash.stdout) {
          log(`stdout: ${bash.stdout}`);
          event.sender.send('bash-reply', new String(bash.stdout));
        }

        if (bash.stderr) {
          log(`stderr: ${bash.stderr}`);
          event.sender.send('bash-reply', new String(bash.stderr));
        }
        
    })

}

module.exports = init

