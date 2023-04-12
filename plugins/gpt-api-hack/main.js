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

ipcMain.on('send-input-all-return', (event,arg)=>{
   // Send input data to the renderer process
   console.log('send-input-all-return ipcMain',arg)
   let obj = {}
   obj.input = arg
   console.log('Request body: ', obj);
   if(obj.input){
        log.webContents.send('chat-all-api-hack-reply', JSON.stringify(obj));
   }
}
);



module.exports = init
