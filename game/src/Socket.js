var Socket = function (addr) {
    var sock;
    if (addr !== undefined) {
        sock = new WebSocket(addr);
    } else {
        sock = new WebSocket("ws://" + prompt("Enter server address", "192.168.20.79:8080"));
    }

    sock.onopen = function (e) {
    }
    sock.onclose = function (e) {
    }
    sock.onmessage = function (e) {
    }
    sock.onerror = function (e) {
    }


    // expose
    this.sock = sock;
}

Socket.prototype = {
    send: function (msg) {
        if (this.sock.readyState !== 1) {
            console.error("Socket not ready:", this.sock.readyState);
            return
        }
        if (typeof msg !== "string") {
            this.sock.send(JSON.stringify(msg));
        } else {
            this.sock.send(msg);
        }
    }
}


module.exports = Socket;
