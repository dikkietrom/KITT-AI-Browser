const {ipcMain, dialog} = require('electron');
const {Configuration, OpenAIApi} = require("openai")

const {apiKeys, promptIt} = require("../../back-end/keys.js")

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
        log('gpt-main init no api key');
        const openAIKey = await promptIt('OpenAI API (not mandatory)', 'openAIKey')
        if (openAIKey) {
            log('gpt-main got key', openAIKey);

            configuration.apiKey = openAIKey
        } else {
            log('no gpt-main  key', openAIKey);

            return
        }
    }
    if (!configuration.organization) {
        log('gpt-main init no organization key');
        const openAIOrg = await promptIt('OpenAI organization ID (not mandatory)', 'openAIOrg')
        if (openAIOrg) {
            log('gpt-main got org', openAIOrg);

            configuration.organization = openAIOrg
        } else {
            log('no gpt-main org', openAIKey);

            return
        }

    }
    configuration = new Configuration({
        organization: apiKeys('openAIOrg'),
        apiKey: apiKeys('openAIKey')
    });
    log('gpt-main init openAI ', configuration);
    openai = new OpenAIApi(configuration);

    log('gpt-main init wait models response ');
    const response = await openai.listEngines();
    log('gpt-main init got response  ');

    modelsData = response.data.data
    // log('gpt-main init got modelsData : ', modelsData);
    log.webContents.send('gpt-models-reply', modelsData)

}

ipcMain.on('gpt-models', (event)=>{
    try {
        event.sender.send('gpt-models-reply', modelsData)
    } catch (error) {
        err(error)
    }
}
);



ipcMain.on('plugin-gpt', (event,arg)=>{
    log('plugin-gpt speak', arg.txt);
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
                'Authorization': 'Bearer ' + apiKeys('openAIKey')
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

        fetch('https://api.openai.com/v1/plugin/completions', requestOptions).then(response=>response.json()).then(data=>{
            log(data)
            log.send('plugin-reply', data)
        }
        ).catch(error=>{
            log.send('plugin-reply', `gpt-main Error: ${error.message}`)

            err(error)
        }
        );

    } catch (error) {
        event.sender.send('plugin-reply', m)
        err(error) 
    }

}

module.exports = init
