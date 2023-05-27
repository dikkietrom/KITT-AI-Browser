const {ipcMain} = require('electron');

async function init(lg) {
    log = lg

}
var _socket
const net = require('net');
const {URL} = require('url');
const querystring = require('querystring');
// Create a server socket
const server = net.createServer((socket)=>{
    _socket = socket
    // Handle incoming connections
    console.log('Client connected');

    socket.on('data', (data)=>{
        const request = data.toString();

        // Parse the request to extract the URL and query parameters
        const [requestLine] = request.split('\r\n');
        const [method,path] = requestLine.split(' ');
        const {pathname, searchParams} = new URL(path,'http://localhost');
        const queryParams = querystring.parse(searchParams.toString());

        // Extract the value of the 'data' parameter
        const dataParamValue = queryParams.data;

        console.log('Received data:', dataParamValue);
        //console.log('Received data:', data.toString());
        log.send('external-request-gpt-api-hack', dataParamValue);
        const response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\n`;
        socket.write(response);
        wait()

    }
    );

    socket.on('end', ()=>{
        // Handle client disconnection
        console.log('Client disconnected');
    }
    );
}
);
let timeOutIdGpt = -1
function wait() {
    timeOutIdGpt = setTimeout(()=>{
        log.send('html-get-last-http-request')

        timeOutIdGpt = -1
    }
    , 3000)
}

ipcMain.on('html-get-last-http-request', (eventy,data)=>{
    if (_socket) {

        _socket.write(data);
        _socket.end();

    }
}
)
let port=3001
// Start the server
server.listen(port, '127.0.0.1', ()=>{
    console.log('Server started on port ' + port);
}
);

ipcMain.on('external-request-gpt-api-hack-main', (event,data)=>{

    if (_socket && timeOutIdGpt > -1) {
        console.log(data)
        clearTimeout(timeOutIdGpt)
        timeOutIdGpt = -1
        //_socket.write(data);
        wait()
    }
}
)

module.exports = init
