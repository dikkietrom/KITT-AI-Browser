const {ipcMain} = require('electron');
const {Configuration, OpenAIApi} = require("openai")

const configuration = new Configuration({
    organization: "org-ypgFoH5wJoja5e2c3Aktylts",
    apiKey: "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",
});
let log
let openai
let modelsData
async function init(lg) {
    log = lg
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
                'Authorization': 'Bearer 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'
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
