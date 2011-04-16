var Socket = function (addr) {
    var sock;
    if (addr !== undefined) {
        sock = new WebSocket(addr);
    } else {
        sock = new WebSocket("ws://" + prompt("Enter server address", "192.168.20.79:8080"));
    }

    sock.onopen = function (e) {
        console.log(e);
    }
    sock.onclose = function (e) {
        console.log(e);
    }
    sock.onmessage = function (e) {
        console.log(e);
    }
    sock.onerror = function (e) {
        console.log(e);
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
        this.sock.send(msg);
    }
}


module.exports = Socket;
