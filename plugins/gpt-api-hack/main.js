const {ipcMain} = require('electron');

async function init(lg) {
    log = lg

    
}

ipcMain.on('gpt-hack-delta-text', (event,arg)=>{
   // Send input data to the renderer process
   log.send('gpt-hack-delta-text',arg)

}
);


ipcMain.on('get-last', (event,last)=>{
   // Send input data to the renderer process
   log.send('get-last',last)

}
);



module.exports = init
