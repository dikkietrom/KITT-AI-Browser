const {ipcMain} = require('electron');

async function init(lg) {
    log = lg

    
}

ipcMain.on('plugin-mj-api-hack', (event,arg)=>{
   // Send input data to the renderer process
   log('plugin-mj-api-hack ipcMain',arg)
   let obj = JSON.parse(buffer)
   log('Request body: ', obj);
   if(obj.input){
        log.webContents.send('plugin-mj-api-hack-reply', arg);
   }

}
);

              

module.exports = init
