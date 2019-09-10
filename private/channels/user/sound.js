let settingValues = {
	masterSound: /0|1/,
	masterVolume: /[0-9][0-9]?0?/,
	musicVolume: /[0-9][0-9]?0?/,
	fxVolume: /[0-9][0-9]?0?/
};
module.exports = function (m, local) {
	let session = local.session;
	let socket = local.socket;
	if (typeof session.user === "object") {
		for (let label in session.user) {
			if (!(label in settingValues)) {
				console.log("bad sess!")
				session.user = undefined;
				break;
			}
		}
		if (session.user !== undefined) {
			for (let label in settingValues) {
				if (!(label in session.user)) {
					console.log("bad sess(2)!");
					session.user = undefined;
					break;
				}
				if (!settingValues[label].test(session.user[label])) {
					console.log("bad sess format!");
					session.user = undefined;
					break;
				}
			}
		}
	}
		
	if (session.user === undefined) {
		session.user = {
			masterSound: null,
			masterVolume: 75,
			musicVolume: 75,
			fxVolume: 75,
		}
	}
	console.log("sound settings:", session.user);
	socket.emit("sound-settings", session.user)
	socket.on("sound-settings", settings => {
		for (let label in settings) {
			if (label in settingValues && settingValues[label].test(settings[label])) {
				session.user[label] = settings[label];
			}
		}
		console.log("new sound settings:", session.user);
	});
}