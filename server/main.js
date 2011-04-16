var http = require("http");
var ws = require("websocket-server");

var nop = function () {};

var BROADCAST_INTERVAL = 2000;
var OVERLORD_SERVER = {
    address: 'http://footieapp.appspot.com',
    port: 80
}
var gameState = {players: {}};

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
    client.send(JSON.stringify({playerid: client.id}));

    client.addListener("message", function(msg){
        // send to all
        //console.log("<<< ", msg);
        try {
            var userData = JSON.parse(msg);
            gameState.players[userData.id] = userData.player;
            gameState.ball = userData.ball;
        } catch(e) {
            console.log('ERR', msg);
        }

        //console.log('>>> ', JSON.stringify(gameState));
        server.broadcast(JSON.stringify(gameState));
    });
});


var broadcaster = setInterval(function () {
    //console.log('>>> ', JSON.stringify(gameState));
    server.broadcast(JSON.stringify(gameState));
}, BROADCAST_INTERVAL);

registerServer(process.argv[2]);
