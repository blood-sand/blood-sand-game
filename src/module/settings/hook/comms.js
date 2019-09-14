const self = this;
let settings = {
	masterSound: null,
	masterVolume: 100
};
Howler.mute(true);
let sounds = self.share.sounds = {
	music: new Howl({
		src: ['/sound/Paint_the_Arena_with_Red.mp3'],
		loop: true,
		autoplay: true,
		volume: 0.5
	}),
	forward: new Howl({
		src: ['/sound/harp_2.mp3']
	}),
	back: new Howl({
		src: ['/sound/harp_1.mp3']
	}),
	up: new Howl({
		src: ['/sound/stone_scraping_1.mp3']
	}),
	down: new Howl({
		src: ['/sound/stone_scraping_2.mp3']
	}),
	switch: new Howl({
		src: ['/sound/stone_6.mp3']
	}),
	dice1: new Howl({
		src: ['/sound/stone_2.mp3']
	}),
	dice2: new Howl({
		src: ['/sound/stone_3.mp3']
	}),
	dice3: new Howl({
		src: ['/sound/stone_4.mp3']
	}),
	bow: new Howl({
		src: ['/sound/fire_bow_sound-mike-koenig.mp3']
	})
};


self.state.mk({
	property: 'masterSound',
	value: null,
	preset: (o, name, val) => {
		if (val !== o[name] && val === 0 || val === 1) {
			settings.masterSound = val;
			if (val) {
				Howler.mute(false);
			}
			if (!val) {
				Howler.mute(true);
			}
			let element = $('#user-settings-dialog [name=master-sound]');
			
			console.log("master sound", val, element.find('.custom-handle').text(), o[name])
			if (o[name] === null && val && element.find('.custom-handle').text() === "Off") {
				//console.log("Fixing slider")
				element.slider('value', settings.masterSound);
				element.find('.custom-handle').text(settings.masterSound ? 'On' : 'Off');
			}
			socket.emit('sound-settings', settings);
			
			return true;
		}
		
		return false;
	}
});

self.state.mk({
	property: 'masterVolume',
	value: null,
	preset: (o, name, val) => {
		if (val !== o[name] && val >= 0 && val <= 100) {
			settings.masterVolume = val;
			Howler.volume(val / 100);
			/*if (val > o[name]) {
				sounds.up.play();
			} else {
				sounds.down.play();
			}*/
			//console.log('volume:', val/100)
			socket.emit('sound-settings', settings);
			return true;
		}
		
		return false;
	}
});
self.state.mk({
	property: 'musicVolume',
	value: null,
	preset: (o, name, val) => {
		if (val !== o[name] && val >= 0 && val <= 100) {
			settings.musicVolume = val;
			sounds.music.volume(val / 100);
			/*if (val > o[name]) {
				sounds.up.play();
			} else {
				sounds.down.play();
			}*/
			socket.emit('sound-settings', settings);
			return true;
		}
		
		return false;
	}
});
self.state.mk({
	property: 'fxVolume',
	value: null,
	preset: (o, name, val) => {
		if (val !== o[name] && val >= 0 && val <= 100) {
			settings.fxVolume = val;
			for (let sound in sounds) {
				if (sound === "music") {
					continue;
				}
				sounds[sound].volume(val / 100);
			}
			/*if (val > o[name]) {
				sounds.up.play();
			} else {
				sounds.down.play();
			}*/
			socket.emit('sound-settings', settings);
			return true;
		}
		
		return false;
	}
});
socket.on('sound-settings', serverSettings => {
	settings = serverSettings;
	for (let label in settings) {
		if (settings[label] === null) {
			$('#user-settings-dialog').dialog('open');
			return;
		}
	}
	self.state.masterSound = settings.masterSound;
	self.state.masterVolume = settings.masterVolume;
	self.state.musicVolume = settings.musicVolume;
	self.state.fxVolume = settings.fxVolume;
	$('[name=master-volume').slider('value', settings.masterVolume);
	$('[name=music-volume').slider('value', settings.musicVolume);
	$('[name=fx-volume').slider('value', settings.fxVolume);
	
});

socket.emit("sound-settings-ready")