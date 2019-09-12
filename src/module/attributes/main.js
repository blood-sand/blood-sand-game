const self = this;
let slideDirection = self.share.slideDirection ? self.share.slideDirection : 'left';
if (!self.loaded) {
	$('#game').append(self.display.box);
	$('head').append("<style>" + self.display.style + "</style>");
	$('#attributes').hide(0).show('slide', {
		direction: slideDirection
	}, 250);
	
	
	new self.hook.comms();

	new self.control.events();
	$( "#attributes .slider" ).slider({
		create: function() {
			$(this).children('.custom-handle').text( $(this).slider("value"));
			/*let input = $(this).siblings('input');
			input.on('change', e => {
				$(this).slider("value", e.target.value);
				$(this).children('.custom-handle').text(e.target.value);
			});
			*/
		},
		slide: function( event, ui ) {
			$(this).children('.custom-handle').text(ui.value);
			let name = $(this).attr('name');
			if (self.state.attributes && name in self.state.attributes) {
				self.state.attributes[name] = ui.value;
			}
			//$(this).siblings('input').val(ui.value).trigger('change');
		},
		min: 3,
		max: 18,
		animate: 'slow'
	});
	$('#attributes [name=abilitySum]').slider('option', 'max', 91).slider('option', 'min', 21);
} else {
	$('#attributes').show('slide', {
		direction: slideDirection
	}, 250);
}