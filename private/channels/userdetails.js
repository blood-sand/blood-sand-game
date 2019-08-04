module.exports = function (m, session) {
	var socket = session.socket;
	var key, result;
	
	socket.on("userdetails", function (data) {
		if (data.ready && session.user) {
			console.log('result data:', session.user);
			socket.emit("userdetails", session.user);
			
		}
	});
};
