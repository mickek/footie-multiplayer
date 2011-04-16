var ws = require("websocket-server");
var server = ws.createServer();


server.addListener("connection", function(client){

    client.addListener("message", function(msg){
        // send to all
        server.broadcast(msg);

        client.send("you crazy coder!");
    });
});


server.listen(8080);
