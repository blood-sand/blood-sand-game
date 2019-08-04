module.exports = function (m, session) {
	var socket = session.socket;
	
	socket.on('userarea', function (data) {
		if (data.contents) {
			socket.emit('userarea', {contents: data.contents});
		}
	});
	
	session.event.on('logged_in', function (success) {
		console.log("logged in?", success)
		if (success === true) {
			socket.emit('userarea', {
				'contents': '<script src="/utils"></script><fieldset data-src="/userarea/userdetails"></fieldset>'
			});
		}
	});
}
