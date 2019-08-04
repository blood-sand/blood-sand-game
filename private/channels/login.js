var expected = {
	'username' : /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/,
	'password' : /^.{5,512}$/
}
module.exports = function (m, session) {
	var socket = session.socket;
	socket.on("login", function (data) {
		socket.emit('login', {'status': "Processing Login.."});
		console.log("Processing Login..");
		console.log(data, socket.id);
		try {
			var result = m.form.process(expected, data);
		} catch (e) {
			console.log("Login Error:", e);
			socket.emit('login', {'status': "(1) No Bueno."});
			return;
		}
		
		m.db.clients.findOne({
			username: result.username
		}, function (err, user) {
			if (err) {
				socket.emit('login', {'status': "(2) No Bueno."});
				return;
			}
			
			if (user === null || !m.form.compare(result.password, user.password)) {
				socket.emit('login', {'status': "Unable to find user."});
				return;
			}
			session.user = user;
			console.log("User:", user.username);
			session.event.emit('logged_in', true);
			m.event.emit('activity', {
				"username": user.username,
				"activity": "Logged in"
			});
		});
	});
};
