const {ipcMain} = require('electron');
const {Configuration, OpenAIApi} = require("openai")

const {apiKeys} = require("../../back-end/keys.js")



async function init() {
    const configuration = new Configuration({
        organization: apiKeys('openAIOrg'),
        apiKey: apiKeys('openAIKey')
    });
    const openai = new OpenAIApi(configuration);

}

ipcMain.on('plugin-dall-e', (event,arg)=>{
    log('plugin-dall-e speak', arg);
    try {
        // Send a message to the server
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKeys('openAIKey')
            },
            body: JSON.stringify({
                "prompt": arg,
                "n": 1,
                "size": "256x256"
            })
        };

        fetch('https://api.openai.com/v1/images/generations', requestOptions).then(response=>response.json()).then(data=>{
            log(data)
            event.sender.send('plugin-reply', data)
        }
        ).catch(error=>{
            event.sender.send('plugin-reply', `dall-e-main Error: ${error.message}`)

            err(error)
        }
        );

    } catch (error) {
        event.sender.send('plugin-reply', m)
        err(error)
    }

}
);

module.exports = init
