const { ipcRenderer } = require('electron');

eval ( ipcRenderer.sendSync('logPreload'))
const log = logPreload
log('ceo test preload')

