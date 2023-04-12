const {ipcMain} = require('electron');

async function init(lg) {
    log = lg

    
}

ipcMain.on('chat-gpt4-api-hack', (event,arg)=>{
   // Send input data to the renderer process
   console.log('chat-gpt4-api-hack ipcMain',arg)
   let obj = JSON.parse(buffer)
   console.log('Request body: ', obj);
   if(obj.input){
        log.webContents.send('chat-gpt4-api-hack-reply', arg);
   }
}
);




module.exports = init
