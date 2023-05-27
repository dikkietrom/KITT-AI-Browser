const fs = require('fs');
const {err} = require('../../lib/shared.js');
const path = require('path');

async function init(lg) {
    log = lg
}
function writeFileSync(json) {
    validate(json)
    return fs.writeFileSync(json.path, json.data)
}
function isFile(json) {
    validate(json)
    log(fs.realpathSync(json.path))

    const stats = fs.statSync(json.path)
    return stats.isFile()

}

function getFileContent(json) {
    try {
        validate(json)
        const data = json.path.charAt(0) == '/' ? fs.readFileSync(__dirname + '/' + json.path, 'utf8') : fs.readFileSync(json.path, 'utf8')
        return data;
    } catch (e) {
        return `${__dirname} \n` + e.stack
    }

}
function validate(json) {
    if (!json.path) {
        throw new Error("json.path is not given")
    }
}
function getFiles(json) {
    validate(json)
    json.files_ = json.files_ || []
    const files = fs.readdirSync(json.path)
    log(files.join('\n'))
    files.forEach((f)=>{
        const file = json.path + '/' + f
        if (file.indexOf('.zip') != -1 || file.indexOf('.exe') != -1 || file.indexOf('.tar.gz') != -1 || file.indexOf('.png') != -1 || file.indexOf('.wav') != -1 || file.indexOf('.mp3') != -1 || file.indexOf('./KITT-mod.iml') == 0 || file.indexOf('./.git') == 0 || file.indexOf('./plugins/whisper/whisper') == 0 || file.indexOf('./.idea') == 0 || file.indexOf('./dist') == 0 || file.indexOf('./node_modules') == 0 || file.indexOf('./build') == 0 || file.indexOf('/.DS_Store') != -1 || file.indexOf('./keys') == 0) {
            return
        }
        log(file)
        try {
            if (fs.statSync(file).isDirectory()) {
                const temp = json.path
                json.path = file
                getFiles(json)
                json.path = temp
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
function mkdirs(json) {
    validate(json)
    const parts = json.path.split(path.sep);
    for (let i = 1; i <= parts.length; i++) {
        const subPath = path.join.apply(null, parts.slice(0, i));
        if (!fs.existsSync(subPath)) {
            fs.mkdirSync(subPath);
        }
    }
}

exports.writeFileSync = writeFileSync
exports.isFile = isFile
exports.getFileContent = getFileContent
exports.getFiles = getFiles
exports.mkdirs = mkdirs
exports.init = init
