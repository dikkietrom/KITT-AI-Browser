const {ipcMain, dialog} = require('electron');
const {Configuration, OpenAIApi} = require("openai")

const {apiKeys, promptIt} = require("../back-end/keys.js")

let log
let openai
let modelsData
async function init(lg) {
    log = lg
    let configuration = new Configuration({
        organization: apiKeys('openAIOrg'),
        apiKey: apiKeys('openAIKey')
    });
    if (!configuration.apiKey) {
        console.log('gpt-main init no api key');
        const openAIKey = await promptIt('OpenAI API (not mandatory)', 'openAIKey')
        if (openAIKey) {
            console.log('gpt-main got key', openAIKey);

            configuration.apiKey = openAIKey
        } else {
            console.log('no gpt-main  key', openAIKey);

            return
        }
    }
    if (!configuration.organization) {
        console.log('gpt-main init no organization key');
        const openAIOrg = await promptIt('OpenAI organization ID (not mandatory)', 'openAIOrg')
        if (openAIOrg) {
            console.log('gpt-main got org', openAIOrg);

            configuration.organization = openAIOrg
        } else {
            console.log('no gpt-main org', openAIKey);

            return
        }

    }
    configuration = new Configuration({
        organization: apiKeys('openAIOrg'),
        apiKey: apiKeys('openAIKey')
    });
    console.log('gpt-main init openAI ', configuration);
    openai = new OpenAIApi(configuration);

    console.log('gpt-main init wait models response ');
    const response = await openai.listEngines();
    console.log('gpt-main init got response  ');

    modelsData = response.data.data
    // console.log('gpt-main init got modelsData : ', modelsData);
    log.webContents.send('gpt-models-reply', modelsData)

}

ipcMain.on('gpt-models', (event)=>{
    try {
        //          console.log('gpt-models', modelsData);
        event.sender.send('gpt-models-reply', modelsData)
    } catch (error) {
        log('main-log', error)
    }

}
);

ipcMain.on('send-input-all-return', (event,txt)=>{
    try {

       console.log('send-input-all-return', txt);
       log.send('chat-reply', txt)

    } catch (error) {
        log('main-log', error)
    }

}
);



ipcMain.on('chat-gpt', (event,arg)=>{
    console.log('chat-gpt speak', arg.txt);
    reqJson(event, arg.txt, arg.model)
}
);

function reqJson(event, txt, dataModel) {
    try {
        // Send a message to the server
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey('openAIKey')
            },
            body: JSON.stringify({
                "model": dataModel,
                "messages": [{
                    "role": "user",
                    "content": txt
                }],
                "temperature": 0.7
            })
        };

        fetch('https://api.openai.com/v1/chat/completions', requestOptions).then(response=>response.json()).then(data=>{
            console.log(data)
            event.sender.send('chat-reply', data)
        }
        ).catch(error=>{
            event.sender.send('chat-reply', `gpt-main Error: ${error.message}`)

            console.log(error)
        }
        );

    } catch (error) {
        let m = `gpt-main Error: ${error.message}`
        event.sender.send('chat-reply', m)
        log(m)
    }

}

module.exports = init
