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
	$('#attributes [name=abilitySum]').val(21).trigger('change');
	$('#attributes [name=abilitySum]').val(91).trigger('change');
});