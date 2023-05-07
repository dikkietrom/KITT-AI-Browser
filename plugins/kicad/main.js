
const {err,imp} = require('../../lib/shared.js');

let log
function init(lg) {
    log = lg

    
}


function makeBoard(json){
    return 'made board'
}

  
function getBoard(json){
    json.path = '../kicad/' + json.path
    return imp('file').getFileContent(json)
}

      

exports.init = init
exports.makeBoard = makeBoard
exports.getBoard = getBoard
