const self = this;

$('#skills [name=name]').val(self.share.name);

$( "#skills .slider" ).slider({
	create: function() {
		$(this).children('.custom-handle').text( $(this).slider("value"));
	},
	slide: function( event, ui ) {
		$(this).children('.custom-handle').text(ui.value);
		let name = $(this).attr('name');
		let skillPoints = 10;
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
	min: 0,
	max: 2,
	animate: 'slow'
});


$('[name="skillsPrevious').on('click', e => {
    self.state.previous = true;
});

$('[name="skillsNext').on('click', e => {
    self.state.next = true;
});