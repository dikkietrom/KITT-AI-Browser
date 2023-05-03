//execute a bash command and return the result syncronised nodeje
const {ipcMain} = require('electron');
const fs = require('fs');
const {spawnSync} = require('child_process');
const {execSync} = require('child_process');
const {mkdirs} = require('../../back-end/keys.js');
const {writeFileSync} = require('../file/main.js');

function init(lg) {
    log = lg
    log('bash init')
}

function execBash(json) {
    const pwd = process.cwd();
    log(pwd);

    // Define the command to execute
    const cmd = './KITT-workspace/exec.sh';
    mkdirs('./KITT-workspace')
    json.loc =cmd
    writeFileSync(json)
    execSync('chmod u+x ' + cmd)
    // Execute the command synchronously
    try {
        return execSync(json.data)
    } catch (error) {
        return error.stack
    }
}

exports.init = init
exports.execBash = execBash
