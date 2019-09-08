const self = this;
let dialog = $('#user-settings-dialog');
dialog.dialog({
	autoOpen: false,
	modal: true,
	show: {
		effect: 'slide',
		duration: 'fast'
	}, 
	hide: {
		effect: 'slide',
		duration: 'fast'
	},
	close: function() {
		let sound = $(this).find('[name=sound]').slider('value');
		self.state.sound = sound;
	}
});

let soundSlider = $('#user-settings-dialog .slider[name=sound]').slider({
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
		self.state.sound = ui.value;
	},
	animate: 'fast'
});

$('body').on('click', '.user-settings-btn', function (e) {
	dialog.dialog('open');
});