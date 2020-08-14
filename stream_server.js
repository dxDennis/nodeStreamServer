const net = require('net'),
    {v4: uuidv4} = require('uuid'),
    hostname = '127.0.0.1',
    port = 3000,
    _NLCode = 13;

let _connected = false, uuid;

const server = net.createServer((socket) => {
    _connected = true;
    uuid = uuidv4();
    console.log('new connection', uuid);
    socket.write("MisterVac Chat-Server\r\n");

    let textLine = '';
    socket.on('data', function (data) {
        if (_connected === true) {
            let txtInput = data.toString('utf8');
            textLine += txtInput;

            if (_NLCode === txtInput.charCodeAt(0)) {
                inputHandler(textLine, this, server);
                textLine = '';
            }
        }

    });

});

const inputHandler = function (textLine, socket) {
    if (_connected) {
        textLine = textLine.replace("\n", "").replace("\r", "");
        socket.write("you wrote:" + textLine + "\n\r");
        switch (textLine) {
            default:
                socket.write("Im not sure what you mean with: '" + textLine + "' ...\n\r");
                break;
            case 'quit':
                socket.write("closing server ..." + textLine + "\n\r");
                console.log('connection closed!', uuid);
                _connected = uuid = false;
                socket.end();
                break;
        }
    }
};

server.listen(port, hostname, () => {
    console.log(`TCP-Server running at http://${hostname}:${port}/`);
});