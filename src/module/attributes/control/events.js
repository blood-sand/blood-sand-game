const self = this;

if (self.share.name) {
	let name = self.share.name;
	$('[name="name"]').val(name);
}
$('[name="attributesPrevious').on('click', e => {
    self.state.previous = true;
});
$('[name="attributesNext').on('click', e => {
    self.state.next = true;
});
$('#attributes input').on('change', e => {
	self.state.attributes[e.target.name] = e.target.value;
});