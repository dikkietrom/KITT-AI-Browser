const {ipcMain, net} = require('electron');
const { err, initShared} = require('../../lib/shared.js');
let log
function init(lg) {
    
    log=lg

}
ipcMain.on('nat-dev-models', (event,json)=>{
    try {


        // Usage:
        (async()=>{
            try {
                event.returnValue = await makeRequest(json);
                log('Response:', event.returnValue);
            } catch (error) {
                err(error)
                console.error(error);
            }
        }
        )();

    } catch (error) {
        err(error)
    }

}
);
async function makeRequest(json) {
    return new Promise((resolve,reject)=>{
        const req = net.request({
            method: json.method,
            url: json.url,
            headers: json.headers
        });

        req.on('response', (res)=>{
            let data = '';
            res.on('data', (chunk)=>{
                data += chunk;
            }
            );

            res.on('end', ()=>{
                resolve(data);
            }
            );
        }
        );

        req.on('error', (err)=>{
            reject(err);
        }
        );

        req.end();
    }
    );
}

module.exports = init
