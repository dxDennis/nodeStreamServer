const net = require('net'),
    {v4: uuidv4} = require('uuid'),
    hostname = '127.0.0.1',
    port = 3000,
    _NLCode = 13;

let _connected = false, uuid, _socket;

const server = net.createServer((socket) => {
    _socket = socket;
    _connected = true;
    uuid = uuidv4();
    _socket.write("Welcome to my new chat-server\r\n");

    let textLine = '';
    _socket.on('data', function (data) {
        if (_connected === true) {
            let txtInput = data.toString('utf8');
            textLine += txtInput;

            if (_NLCode === txtInput.charCodeAt(0)) {
                inputHandler(textLine);
                textLine = '';
            }
        }
    });

});

const answer = function (answerMsg) {
    _socket.write(answerMsg + "\n\r");
    console.info("server:\t<\t" + answerMsg);
}
const inputHandler = function (textLine) {
    if (_connected) {
        textLine = textLine.replace("\n", "").replace("\r", "");
        console.info("client:\t>\t" + textLine);

        switch (textLine) {
            default:
                answer("Im not sure what you mean with: '" + textLine + "'!");
                break;
            case '':
                answer("is this all you have to say?");
                break;
            case 'quit':
                answer("closing server ...");
                _connected = uuid = false;
                _socket.end();
                break;
        }
    }
};

server.listen(port, hostname, () => {
    console.info(`Chat-Server running at http://${hostname}:${port}/` + "\n\r*********************************\n\r");
});