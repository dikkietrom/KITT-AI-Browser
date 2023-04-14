const {ipcMain} = require('electron');
const {Configuration, OpenAIApi} = require("openai")
const {apiKeys} = require("../../back-end/keys.js")


let log
async function init(lg) {
    log = lg
    const configuration = new Configuration({
        organization: apiKeys('openAIOrg'),
        apiKey: apiKeys('openAIKey')
    });
}


 

ipcMain.on('plugin-gpt-edit', (event,arg)=>{
    log('plugin-gpt-edit speak', arg.txt);
    reqJson(event, arg.txt, arg.instruction ,arg.model)
}
);

function reqJson(event, txt, instruction,dataModel) {
    try {
        // Send a message to the server
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKeys('openAIKey')
            },
            body: JSON.stringify({
                "model": dataModel,
                "instruction": instruction,
                "input":  txt
                })
        };

        fetch('https://api.openai.com/v1/edits', requestOptions).then(response=>response.json()).then(data=>{
            log(data)
            event.sender.send('plugin-reply', data)
        }
        ).catch(error=>{
            event.sender.send('plugin-reply', `gpt-edit-main Error: ${error.message}`)

            log(error)
        }
        );

    } catch (error) {
        let m = `gpt-edit-main Error: ${error.message}`
        event.sender.send('plugin-reply', m)
        log(m)
    }

}

module.exports = init
