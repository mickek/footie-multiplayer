var http = require("http");
var ws = require("websocket-server");

var nop = function () {};

var BROADCAST_INTERVAL = 2000;
var OVERLORD_SERVER = {
    address: 'http://footieapp.appspot.com',
    port: 80
}
var clients = {};
var gameState = {};

var registerServer = function (listeningOn) {
    var req = http.request({
            host: OVERLORD_SERVER.address,
            port: OVERLORD_SERVER.port,
            path: '/',
            method: 'POST'
        }, nop);

    req.write("http://" + listeningOn + "\n");
    req.end();
}

if (process.argv.length !== 3) {
    console.info('Usage: ' + process.argv[1] + ' <address>');
    process.exit(1);
}



var server = ws.createServer();
server.listen(8080);

server.addListener("connection", function(client){
    // register
    clients[client.id] = client;

    client.addListener("message", function(msg){
        // send to all
        server.broadcast(msg);

        client.send("you crazy coder!");
    });
    client.addListener("close", function () {
        delete clients[client.id];
    });
});


var broadcaster = setInterval(function () {
    server.broadcast(JSON.stringify(gameState));
}, BROADCAST_INTERVAL);

registerServer(process.argv[2]);
