module.exports = function (m) {
	var io = require('socket.io').listen(m.app.listen(m.port), {
		"log level": 1
	});
	var dir = m.fs.readdirSync('./private/' + m.config.socket.dir);
	var index;
	var channels = [];
	for (index in dir) {
		channels.push(require('../' + m.config.socket.dir + '/' + dir[index]));
	}
	m.session = {};
	m.sockets = io.sockets;
	m.sockets.on('connection', function (socket) {
		console.log("Session created:", socket.id);
		m.session[socket.id] = {
			socket: socket,
			event: m.eventEmitter()
		};
		console.log("Someone connected");
		
		socket.on('disconnect', function () {
			var username = "Somebody";
			if (m.session[socket.id].user) {
				username = m.session[socket.id].user.username;
			}
			m.event.emit('activity', {
				"username": username,
				"activity": "Disconnected"
			});
			console.log("Session deleted:", socket.id);
			delete m.session[socket.id];
		});
		
		for (var i in channels) {
			channels[i](m, m.session[socket.id]);
		}
	});
};
