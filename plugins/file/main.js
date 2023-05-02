const fs = require('fs');
const {err} = require('../../lib/shared.js');

async function init(lg) {
    log = lg
}
function writeFileSync(json) {
    return fs.writeFileSync(json.loc, json.data)
}
function isFile(json) {
    try {
        const stats = fs.statSync(json.filePath)
        return stats.isFile()
    } catch (e) {
        err(e)
        return e.stack
    }
}

function getFileContent(json) {
    try {
        const data = fs.readFileSync(json.filePath, 'utf8');
        return data;
    } catch (e) {
        err(e)
        return e.stack
    }
}

function getFiles(json) {
    if (!json.dir) {
        throw new Error("json.dir is not given")
    }
    json.files_ = json.files_ || []
    const files = fs.readdirSync(json.dir)
    log(files.join('\n'))
    files.forEach((f)=>{
        const file = json.dir + '/' + f
        if (file.indexOf('.zip') !=-1 || file.indexOf('.exe') !=-1 || file.indexOf('.tar.gz') !=-1 || file.indexOf('.png') !=-1 || file.indexOf('.wav') !=-1 || file.indexOf('.mp3') !=-1 || file.indexOf('./KITT-mod.iml') == 0 || file.indexOf('./.git') == 0 || file.indexOf('./plugins/whisper/whisper') == 0 || file.indexOf('./.idea') == 0 || file.indexOf('./dist') == 0 || file.indexOf('./node_modules') == 0 || file.indexOf('./build') == 0 || file.indexOf('/.DS_Store') != -1 || file.indexOf('./keys') == 0) {
            return
        }
        log(file)
        try {
            if (fs.statSync(file).isDirectory()) {
                const temp = json.dir
                json.dir = file
                getFiles(json)
                json.dir = temp
            } else {
                json.files_.push(file)
            }
        } catch (e) {
            log(e)
        }
    }
    )
    return json.files_
}
exports.writeFileSync = writeFileSync
exports.isFile = isFile
exports.getFileContent = getFileContent
exports.getFiles = getFiles
exports.init = init
