const path = require('path');
const sharedSession = require('express-socket.io-session');
module.exports = function (m) {
    var io = require('socket.io').listen(m.app.listen(m.port), {
        "log level": 1
    });
    io.use(sharedSession(m.expressSession, {
        autoSave: true
    }));
    var dir = m.fs.readdirSync('./private/' + m.config.socket.dir);
    var index;
    var channels = [];
    for (index in dir) {
        console.log(m.root, 'private/', m.config.socket.dir, dir[index])
        let candidate = path.join(m.root, 'private/', m.config.socket.dir, dir[index]);
        if (m.fs.lstatSync(candidate).isDirectory()) {
            continue;
        }
        channels.push(require(candidate));
    }
    m.sockets = io.sockets;
    m.sockets.on('connection', function (socket) {
        //console.log("cookies:", socket.request.cookies);
        console.log(socket.handshake.session);
        let session = socket.handshake.session;
        let local = {
            socket,
            session,
            event: new m.eventEmitter()
        };
        socket.on('disconnect', function () {
            
            console.log("Session disconnected:");
        });
        
        for (var i in channels) {
            channels[i](m, local);
        }
    });
};
