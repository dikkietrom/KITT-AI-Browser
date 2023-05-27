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
                path: content
            })
            if (returnValue && returnValue.indexOf && returnValue.indexOf('Error') >= 0) {
                returnValue = returnValue
                //duh
            } else if (returnValue) {
                returnValue = getFileContent({
                    path: content
                })
            } else if (message.to[1] === Plugin.feed) {
                let arr = []
                let files = getFiles({
                    path: content
                })

                let temp = []
                files.forEach(f=>{
                    if (f.substring(content.length).indexOf('/.') < 0) {
                        temp.push(f)
                    }
                }
                )
                files = temp
                if (!files.forEach && files.indexOf && files.indexOf('Error') == 0) {
                    returnValue = files
                } else {
                    files.forEach((path)=>{
                        arr.push(path + ' : ' + getFileContent({
                            path: path
                        }))
                    }
                    )
                }
                returnValue = arr.join('\n')
            } else {
                returnValue = getFiles({
                    path: content
                })

                let temp = []
                returnValue.forEach(f=>{
                    if (f.substring( content.length  ).indexOf('/.') < 0) {
                        temp.push(f)
                    }
                }
                )
                returnValue = temp
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
function writeFileSync(json) {
    return doInMain(arguments, 'file')
}

new File()
