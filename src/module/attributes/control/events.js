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
$('#attributes input').on('change', e => {
	if (self.state.attributes && e.target.name in self.state.attributes) {
		self.state.attributes[e.target.name] = e.target.value;
	}
});
$('#attributes .randomizeAttributes').on('click', e => {
	let abilitySum = $('#attributes [name=abilitySum]');
	let slider = abilitySum.siblings('div.slider');
	/*
	$('.slider').each(function () {
		if ($(this).siblings('[name=abilitySum]').length === 0) {
			$(this).slider('value', 3).children().text(3);
		} else {
			$(this).slider('value', 21).children().text(21);
		}
	});
	*/
	//self.state.ignoreChange = true;
	//slider.slider('option', 'slide').call(slider, null, {value: 91});
	slider.slider('option', 'slide').call(slider, null, {value: 21});
	
	setTimeout(() => {
		//$('.slider').siblings('input').val(3).change();
		//slider.siblings('input').val(21).change();
		//slider.slider('option', 'slide').call(slider, null, {value: 21})
		//self.state.ignoreChange = false;
		slider.slider('option', 'slide').call(slider, null, {value: 91});
	}, 700);
});