const self = this;
if (!self.loaded) {
	console.log("first load of attributes");
	$('#game').append(self.display.box);
	$('head').append("<style>" + self.display.style + "</style>");
	
	
	self.hook.comms();

	self.control.events();
	$( ".slider" ).slider({
		create: function() {
			$(this).children('.custom-handle').text( $(this).slider("value"));
			let input = $(this).siblings('input');
			input.on('change', e => {
				$(this).slider("value", e.target.value);
				$(this).children('.custom-handle').text(e.target.value);
			});
		},
		slide: function( event, ui ) {
			$(this).children('.custom-handle').text(ui.value);
			$(this).siblings('input').val(ui.value).trigger('change');
		},
		min: 3,
		max: 18
	});
	$('[name=abilitySum]').siblings('.slider').slider('option', 'max', 91).slider('option', 'min', 21);
} else {
	$('#attributes').show();
}
