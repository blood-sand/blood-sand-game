module.exports = function (m, session) {
	var socket = session.socket;
	
	socket.emit("content", {
		title: "Welcome to Web Site!",
		date: new Date().toString(),
		body: "Please log in to view content..."
	});
	
	session.event.on("logged_in", function (success) {
		if (success === true) {
			socket.emit("content", {
				title: "Welcome Back, " + session.user.username,
				date: new Date().toString(),
				body: "Some data-src will go here..."
			});
		}
	});
};
