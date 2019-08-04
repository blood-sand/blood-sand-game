var expected = {
	'username' : /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/,
	'email' : /^[^@]{1,255}@[^@]{1,255}$/,
	'email_repeat': /.*/,
	'password' : /^.{5,511}$/,
	'password_repeat': /.*/
}
module.exports = function (m, session) {
	var socket = session.socket;
	socket.on("register", function (data) {
		console.log("Processing Register..");
		socket.emit('userarea', {'contents': 'Processing Registration..'});
		console.log(data);
		try {
			var result = m.form.process(expected, data);
		} catch (e) {
			console.log("Register Error:", e);
			socket.emit('register', {'status': "(1) No Bueno."});
			return;
		}
		
		m.db.clients.findOne({
			username: result.username
		}, function (err, user) {
			socket.emit('userarea', {'contents': '<script src="/utils"></script><fieldset data-src="/userarea/loginOrRegister"></fieldset>'});
			if (err) {
				socket.emit('register', {'status': "(2) No Bueno."});
			}
			if (user !== null) {
				socket.emit('register', {'status': "(3) Username already exists."});
				return;
			} else {
				m.db.clients.insert({
					username: result.username, 
					email: result.email,
					password: m.form.hash(result.password),
				}, function (err, user) {
					session.user = user
					session.event.emit('logged_in', true);
					m.event.emit('activity', {
						"username": result.username,
						"activity": "Registerred"
					});
				});
			}
		});
	});
};
