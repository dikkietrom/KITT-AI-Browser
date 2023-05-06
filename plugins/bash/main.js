//execute a bash command and return the result syncronised nodeje
const {ipcMain} = require('electron');
const fs = require('fs');
const {spawn,spawnSync} = require('child_process');
const {writeFileSync} = require('../file/main.js');

function init(lg) {
    log = lg
    log('bash init')
}

function execBash(json) {
     
    try {

        if (!json.code) {
            throw new Error('No code passed, json.code is empty.')
        }


        let cmd = 'plugins/bash/exec.sh'
        writeFileSync({path:cmd,data:json.code})
        const { spawn } = require('child_process');

        const result = spawnSync(cmd);


        // Spawn a child process
        // Log the output of the child process


        // Return the output of the child process regardless of error status
        const output = !result.error ? result.output.join('\n') : result.error
        log(output)
//        // Stream the output of the child process to the parent process
//        child.stdout.on('data', (data) => {
//          console.log(`child stdout:\n${data}`);
//        });
//
//        // Handle errors from the child process
//        child.on('error', (error) => {
//          console.error(`child error:\n${error}`);
//        });
//
//        // Handle the child process exit event
//        child.on('exit', (code, signal) => {
//          console.log(`child process exited with code ${code} and signal ${signal}`);
//        });



        return 'Output : ' + output + '\n from : ' + json.code
    } catch (error) {
        return error.stack
    }
}

exports.init = init
exports.execBash = execBash
