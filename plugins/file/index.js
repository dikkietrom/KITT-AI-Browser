class File extends Plugin {
    constructor(arg) {
        super(arg)
    }

    config() {
        return {
            name: 'File',
            id: 'file',
            description: 'File',
            role: 'worker',
            active: true,
        }
    }

    exec(message) {
        try {
            let content = message.content.trim()
            let returnValue = isFile({
                filePath: content
            })
            if (returnValue && returnValue.indexOf && returnValue.indexOf('Error')==0) {
                returnValue = returnValue //duh
            } else if (returnValue) {
                returnValue = getFileContent({
                    filePath: content
                })
            } else if (message.to[1] === Plugin.feed) {
                let arr = []
                let files = getFiles({
                    dir: content
                })
                if (!files.forEach && files.indexOf && files.indexOf('Error') == 0) {
                    returnValue = files
                } else {
                    files.forEach((path)=>{
                        arr.push(path + ' : ' + getFileContent({
                            filePath: path
                        }))
                    }
                    )
                }
                returnValue = arr.join('\n')
            } else {
                returnValue = getFiles({
                    dir: content
                })
                returnValue = returnValue.join('\n')
            }
            return returnValue
        } catch (e) {
            err(e)
            return e.stack
        }
    }
}
function isFile(json) {
    return doInMain(arguments, 'file')
}

function getFileContent(json) {
    return doInMain(arguments, 'file')
}

function getFiles(json) {
    return doInMain(arguments, 'file')
}

new File()
