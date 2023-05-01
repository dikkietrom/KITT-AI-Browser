const {ipcMain} = require('electron');

async function init(lg) {
    log = lg

    
}

ipcMain.on('html-delta-text', (event,arg)=>{
   // Send input data to the renderer process
   log.send('html-delta-text',arg)

}
);


ipcMain.on('html-get-last', (event,last)=>{
   log('html-get-last')
   log.send('html-get-last',last)

}
);



module.exports = init
