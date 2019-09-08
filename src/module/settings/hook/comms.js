const self = this;
let settings = {
	sound: null
};
let sounds = {
	creator: new Audio('/sound/Era_of_Terror_Main_Theme_2.mp3')
};

function playWhenAllowed (sound) {
	$(document).one('mousedown', () => {
		sounds[sound].play();
	});
}

sounds.creator.loop = true;

function soundPlaying(property) {
	return sounds[property] &&
			sounds[property].currentTime > 0 &&
			!sounds[property].paused &&
			!sounds[property].ended &&
			sounds[property].readyState > 2;
}
self.state.mk({
	property: 'sound',
	value: null,
	preset: (o, name, val) => {
		if (val !== o[name] && val === 0 || val === 1) {
			settings.sound = val;
			if (val && !soundPlaying('creator')) {
				sounds.creator.play();
			}
			if (!val && soundPlaying('creator')) {
				sounds.creator.pause();
				sounds.creator.currentTime = 0;
			}
			socket.emit('user-settings', settings);
			return true;
		}
		return false;
	}
});

socket.on('user-settings', serverSettings => {
	settings = serverSettings;
	for (let label in settings) {
		if (settings[label] === null) {
			$('#user-settings-dialog').dialog('open');
			return;
		}
	}
	if (settings.sound) {
		if(!soundPlaying('creator')) {
			let playPromise = sounds.creator.play();
			playPromise.catch(error => {
				// autoplay prevented
				playWhenAllowed('creator');
			});
		}
	}
	$('#user-settings-dialog [name=sound]').slider('value', settings.sound);
	$('#user-settings-dialog [name=sound] .custom-handle').text(settings.sound ? 'On' : 'Off')
});

socket.emit("user-settings-ready")