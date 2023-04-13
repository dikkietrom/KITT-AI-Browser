const {ipcMain} = require('electron');

async function init(lg) {
    log = lg

    
}
let load = 0
ipcMain.on('send-input-google-return', (event,arg)=>{
    if(load==0){
       load++
        return
    }
   // Send input data to the renderer process
   console.log('send-input-google-return ipcMain',arg)
   let obj = {}
   obj.input = arg
   console.log('Request body: ', obj);
   if(obj.input){
        log.webContents.send('chat-google-reply', JSON.stringify(obj));
   }
   
}
);


module.exports = init
