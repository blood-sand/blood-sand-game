let settingLabels = [
	'sound'
];

let settingValues = {
	sound: /0|1/
}
module.exports = function (m, local) {
	let session = local.session;
	let socket = local.socket;
	if (session.user === undefined) {
		session.user = {
			sound: null
		}
	}
	console.log("user settings:", session.user);
	socket.emit("user-settings", session.user)
	socket.on("user-settings", settings => {
		for (let label in settings) {
			if (label in settingValues && settingValues[label].test(settings[label])) {
				session.user[label] = settings[label];
			}
		}
		console.log("new settings:", session.user);
	});
}