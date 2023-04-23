const {ipcMain} = require('electron');
let log
function init(lg) {
    log = lg
    console.log(init)
}

ipcMain.on('oa-delta-text', (event,arg)=>{
   // Send input data to the renderer process
   log.send('oa-delta-text',arg)

}
);


module.exports = init
