const {ipcMain} = require('electron');

async function init(lg) {
    log = lg

    
}

ipcMain.on('chat-mj-api-hack', (event,arg)=>{
   // Send input data to the renderer process
   console.log('chat-mj-api-hack ipcMain',arg)
   let obj = JSON.parse(buffer)
   console.log('Request body: ', obj);
   if(obj.input){
        log.webContents.send('chat-mj-api-hack-reply', arg);
   }

}
);

              

module.exports = init
