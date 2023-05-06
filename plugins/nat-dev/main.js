const {ipcMain, net} = require('electron');
const { err, initShared} = require('../../lib/shared.js');
let log
function init(lg) {
    
    log=lg

}
ipcMain.on('nat-dev-models', (event,json)=>{
    try {

        json.headers = {};
        let headers = json.headers

        headers["sec-ch-ua"] = "\"Not A(Brand\";v=\"24\", \"Chromium\";v=\"110\"";
        headers["baggage"] = "sentry-environment=dev,sentry-public_key=ba8762f0657a48cbb62daf5f4b68cc91,sentry-trace_id=785b9ff90487414da8630d916abac1f2,sentry-sample_rate=1";
        headers["sec-ch-ua-mobile"] = "?0";
        headers["User-Agent"] = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) KITT/23.3.0 Chrome/110.0.5481.208 Electron/23.3.0 Safari/537.36";
        headers["Authorization"] = "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Imluc18yTWtjQlhndjhpbEwxcGNDTnB3MXV5anF0azgiLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwczovL25hdC5kZXYiLCJleHAiOjE2ODMzMzAzMTMsImlhdCI6MTY4MzMzMDI1MywiaXNzIjoiaHR0cHM6Ly9jbGVyay5uYXQuZGV2IiwianRpIjoiMGRlMWY4ZjdlOWI5YmVlZTBlOWQiLCJuYmYiOjE2ODMzMzAyNDMsInNpZCI6InNlc3NfMlBMd2pTTVFTY0hCWkZ5a1N2QXNCZDlMVG0yIiwic3ViIjoidXNlcl8yUEtMS3k3aEZFVlFoRVFZaVV3bG5ibFZ2ODEiLCJ1c2VyX2VtYWlsIjoiODc3NzMzM0BnbWFpbC5jb20iLCJ1c2VyX2ZpcnN0X25hbWUiOiItIiwidXNlcl9pZCI6InVzZXJfMlBLTEt5N2hGRVZRaEVRWWlVd2xuYmxWdjgxIiwidXNlcl9sYXN0X25hbWUiOiItIn0.YaazaYVuPH53Z6l6UOunmVXGzATkdphOYV5k9cZqMVlrJU80bSlIjblfTq3oVC15NWzc8BW3rNwZDkwZuc0Jyj-vGR7ERMJIaUx6pq93onrVhqM5fiXASzaYqaRFbl3z4pCegDNk7XcRpDS3q9aZiyX22IhNr95oDKlBC_2i-Xp-IXPB11KccB3EezLj70omw0V44otOLlj3jS6SDXMhlkGroezfT2mA2KAop_jigOUORW7G6DJDwTFoYq642Xkrs3nQzvJVKbR6P8fuHkLcdm7blCnf7KUTpCWmECeXav4GJuHpnCnGYkw7FbL7mbg2mzkEMM9pLMBpIvORihKDLg";
        headers["sentry-trace"] = "785b9ff90487414da8630d916abac1f2-938d29a1f1d0a206-1";
        headers["sec-ch-ua-platform"] = "\"macOS\"";
        headers["Accept"] = "*/*";
        headers["Sec-Fetch-Site"] = "same-origin";
        //headers["Sec-Fetch-Mode"] = "cors";
        headers["Sec-Fetch-Dest"] = "empty";
        headers["Referer"] = "https://nat.dev/";
        headers["Accept-Encoding"] = "gzip, deflate, br";
        headers["Accept-Language"] = "en-GB";
        headers["Cookie"] = "__client_uat=1683249804; eyJhbGciOiJSUzI1NiIsImtpZCI6Imluc18yTWtjQlhndjhpbEwxcGNDTnB3MXV5anF0azgiLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwczovL25hdC5kZXYiLCJleHAiOjE2ODMzMzAzMTMsImlhdCI6MTY4MzMzMDI1MywiaXNzIjoiaHR0cHM6Ly9jbGVyay5uYXQuZGV2IiwianRpIjoiMGRlMWY4ZjdlOWI5YmVlZTBlOWQiLCJuYmYiOjE2ODMzMzAyNDMsInNpZCI6InNlc3NfMlBMd2pTTVFTY0hCWkZ5a1N2QXNCZDlMVG0yIiwic3ViIjoidXNlcl8yUEtMS3k3aEZFVlFoRVFZaVV3bG5ibFZ2ODEiLCJ1c2VyX2VtYWlsIjoiODc3NzMzM0BnbWFpbC5jb20iLCJ1c2VyX2ZpcnN0X25hbWUiOiItIiwidXNlcl9pZCI6InVzZXJfMlBLTEt5N2hGRVZRaEVRWWlVd2xuYmxWdjgxIiwidXNlcl9sYXN0X25hbWUiOiItIn0.YaazaYVuPH53Z6l6UOunmVXGzATkdphOYV5k9cZqMVlrJU80bSlIjblfTq3oVC15NWzc8BW3rNwZDkwZuc0Jyj-vGR7ERMJIaUx6pq93onrVhqM5fiXASzaYqaRFbl3z4pCegDNk7XcRpDS3q9aZiyX22IhNr95oDKlBC_2i-Xp-IXPB11KccB3EezLj70omw0V44otOLlj3jS6SDXMhlkGroezfT2mA2KAop_jigOUORW7G6DJDwTFoYq642Xkrs3nQzvJVKbR6P8fuHkLcdm7blCnf7KUTpCWmECeXav4GJuHpnCnGYkw7FbL7mbg2mzkEMM9pLMBpIvORihKDLg";

        // Usage:
        (async()=>{
            try {
                event.returnValue = await makeRequest(json);
                console.log('Response:', event.returnValue);
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
