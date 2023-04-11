const {ipcMain} = require('electron');
const {Configuration, OpenAIApi} = require("openai")

const configuration = new Configuration({
    organization: "org-ypgFoH5wJoja5e2c3Aktylts",
    apiKey: "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",
});
let log
async function init(lg) {
    log = lg
    
}


 

ipcMain.on('chat-gpt-edit', (event,arg)=>{
    console.log('chat-gpt-edit speak', arg.txt);
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
                'Authorization': 'Bearer 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'
            },
            body: JSON.stringify({
                "model": dataModel,
                "instruction": instruction,
                "input":  txt
                })
        };

        fetch('https://api.openai.com/v1/edits', requestOptions).then(response=>response.json()).then(data=>{
            console.log(data)
            event.sender.send('chat-reply', data)
        }
        ).catch(error=>{
            event.sender.send('chat-reply', `gpt-edit-main Error: ${error.message}`)

            console.log(error)
        }
        );

    } catch (error) {
        let m = `gpt-edit-main Error: ${error.message}`
        event.sender.send('chat-reply', m)
        log(m)
    }

}

module.exports = init
