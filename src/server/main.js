var ws = require("websocket-server");
var server = ws.createServer();


server.addListener("connection", function(connection){
    console.log("connected");

    connection.addListener("message", function(msg){
        console.log("sending back: ", msg);
        server.broadcast(msg);
    });
});


server.listen(8080);
