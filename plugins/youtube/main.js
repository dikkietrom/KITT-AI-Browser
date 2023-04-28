const {ipcMain} = require('electron');

async function init(lg) {
    log = lg

    
}



ipcMain.on('send-input-youtube-return', (event,arg)=>{

   // Send input data to the renderer process
   log('send-input-youtube-return ipcMain',arg.substring(0,20)+'')
   let obj = {}
   obj.input = arg
   log('Request body: ', obj);
   if(obj.input){
        log.webContents.send('plugin-youtube-reply', JSON.stringify(obj));
   }

}
);



module.exports = init
