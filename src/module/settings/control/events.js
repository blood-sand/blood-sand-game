const self = this;
let dialog = $('#user-settings-dialog');
dialog.dialog({
	autoOpen: false,
	modal: true,
	width: 720,
	show: {
		effect: 'slide',
		duration: 'fast'
	}, 
	hide: {
		effect: 'slide',
		duration: 'fast'
	},
	close: function() {
		self.share.sounds.down.play();
		self.state.masterSound = $(this).find('[name=master-sound]').slider('value');
		self.state.masterVolume = $(this).find('[name=master-volume]').slider('value');
		self.state.musicVolume = $(this).find('[name=music-volume]').slider('value');
		self.state.fxVolume = $(this).find('[name=fx-volume]').slider('value');
		//self.state.sound = sound;
	},
	open: function () {
		self.share.sounds.up.play();
	}
});

let masterSoundOn = $('#user-settings-dialog .slider[name=master-sound]').slider({
	value: 0,
	min: 0,
	max: 1,
	step: 1,
	create: function() {
		let value = $(this).slider('value');
		$(this).children('.custom-handle').text(value ? 'On' : 'Off');
	},
	slide: function (event, ui) {
		$(this).children(".custom-handle").text(ui.value ? 'On' : 'Off');
		self.state.masterSound = ui.value;
	},
	animate: 'fast'
});

let masterVolume = $('#user-settings-dialog .slider[name=master-volume]').slider({
	value: 80,
	min: 0,
	max: 100,
	step: 5,
	create: function() {
		//let value = $(this).slider('value');
		//$(this).children('.custom-handle').text(value ? 'On' : 'Off');
	},
	slide: function (event, ui) {
		//$(this).children(".custom-handle").text(ui.value ? 'On' : 'Off');
		self.state.masterVolume = ui.value;
	},
	animate: 'fast'
});

let musicVolume = $('#user-settings-dialog .slider[name=music-volume]').slider({
	value: 80,
	min: 0,
	max: 100,
	step: 5,
	create: function() {
		//let value = $(this).slider('value');
		//$(this).children('.custom-handle').text(value ? 'On' : 'Off');
	},
	slide: function (event, ui) {
		//$(this).children(".custom-handle").text(ui.value ? 'On' : 'Off');
		self.state.musicVolume = ui.value;
	},
	animate: 'fast'
});

let fxVolume = $('#user-settings-dialog .slider[name=fx-volume]').slider({
	value: 80,
	min: 0,
	max: 100,
	step: 5,
	create: function() {
		//let value = $(this).slider('value');
		//$(this).children('.custom-handle').text(value ? 'On' : 'Off');
	},
	slide: function (event, ui) {
		//$(this).children(".custom-handle").text(ui.value ? 'On' : 'Off');
		self.state.fxVolume = ui.value;
	},
	animate: 'fast'
});

$('body').on('click', '.user-settings-btn', function (e) {
	//self.share.sounds.stone.currentTime = 0;
	//self.share.sounds.stone.play();
	dialog.dialog('open');
});

$('body').on('click', '.dice', () => {
	function randomDie () {
	    return 1 + (3 * Math.random() << 0);
	};
	let r = randomDie();
	let sound = self.share.sounds["dice" + r];
	//console.log('sound:', r, sound);
	sound.play();
});