const {ipcMain} = require('electron');
const {Configuration, OpenAIApi} = require("openai")

const {apiKeys} = require("../back-end/keys.js")



async function init() {
    const configuration = new Configuration({
        organization: apiKeys('openAIOrg'),
        apiKey: apiKeys('openAIKey')
    });
    const openai = new OpenAIApi(configuration);

}

ipcMain.on('chat-dall-e', (event,arg)=>{
    console.log('chat-dall-e speak', arg);
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
            console.log(data)
            event.sender.send('chat-reply', data)
        }
        ).catch(error=>{
            event.sender.send('chat-reply', `dall-e-main Error: ${error.message}`)

            console.log(error)
        }
        );

    } catch (error) {
        let m = `dall-e-main Error: ${error.message}`
        event.sender.send('chat-reply', m)
        log(m)
    }

}
);

module.exports = init
