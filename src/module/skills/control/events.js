const self = this;

$('#skills [name=name]').val(self.share.name);

$( "#skills .slider" ).slider({
	create: function() {
		let name = $(this).attr('name');
		let max = self.share.skillMaxes[name];
		$(this).slider('option', 'max', max);
		$(this).children('.custom-handle').text( $(this).slider("value"));
	},
	slide: function( event, ui ) {
		
		let name = $(this).attr('name');
		let max = $(this).slider('option', 'max');
		let highestPoint = self.state.skillPoints + $(this).slider('value');
		let skillCeiling = (modules.biometrics.prototype.state.biometrics.rank || 0) * 2
		console.log("current value:", $(this).slider('value'));
		console.log("new value", ui.value);
		console.log("max", max);
		console.log('available points:', self.state.skillPoints);
		console.log('skill ceiling', skillCeiling);
		if (skillCeiling < highestPoint) {
			highestPoint = skillCeiling;
		}
		if (max < highestPoint) {
			highestPoint = max;
		}
		
		if (ui.value > highestPoint) {
			ui.value = highestPoint;
		}
		console.log('highest', highestPoint, 'val', ui.value);
		$(this).children('.custom-handle').text(ui.value);
		console.log("skills:", self.state.skills)
		if (self.state.skills && name in self.state.skills) {
			self.state.skills[name] = ui.value;
		}
		if (ui.value !== self.state.skills[name]) {
			ui.value = self.state.skills[name];
			$(this).children('.custom-handle').text(ui.value);
			return false;
		}
	},
	stop: function (event, ui) {
		let name = $(this).attr('name');
		console.log("stop", ui.value, self.state.skills[name]);
		if (ui.value !== self.state.skills[name]) {
			$(this).slider('option', 'value', self.state.skills[name]);
		}
	},
	min: 0,
	max: 16,
	animate: 'slow'
});


$('[name="skillsPrevious').on('click', e => {
    self.state.previous = true;
});

$('[name="skillsNext').on('click', e => {
    self.state.next = true;
});