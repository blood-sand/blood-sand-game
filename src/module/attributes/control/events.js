const self = this;

if (self.share.name) {
	$('[name="name"]').val(self.share.name);
}
$('[name="attributesPrevious').on('click', e => {
    self.state.previous = true;
});
$('[name="attributesNext').on('click', e => {
    self.state.next = true;
});

$( "#attributes .slider" ).slider({
	create: function() {
		$(this).children('.custom-handle').text( $(this).slider("value"));
	},
	slide: function( event, ui ) {
		$(this).children('.custom-handle').text(ui.value);
		let name = $(this).attr('name');
		if (self.state.attributes && name in self.state.attributes) {
			self.state.attributes[name] = ui.value;
		}
	},
	min: 3,
	max: 18,
	animate: 'slow'
});
$('#attributes [name=abilitySum]').slider('option', 'max', 91).slider('option', 'min', 21);

$('#attributes .randomizeAttributes').on('click', e => {
	let abilitySum = $('#attributes [name=abilitySum]');

	abilitySum.slider('option', 'slide').call(abilitySum, null, {value: 21});
	setTimeout(() => {
		abilitySum.slider('option', 'slide').call(abilitySum, null, {value: 91});
	}, 700);
});