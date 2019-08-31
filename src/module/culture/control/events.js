const self = this;
console.log(self)
$('[name="culture"]').on('change', e => {
    self.state.culture = $(e.target).val();
});

$('[name="sex"]').on('change', e => {
    self.state.sex = $(e.target).val();
});

$('body').on('change', '[name="name"]', e => {
    self.state.name = e.target.value;
});
$('body').on('click', '.randomizeName', e => {
	self.generateName();
});
$('[name="cultureNext').on('click', e => {
    if (self.state.culture === "culture") {
        return;
    }
    self.state.next = true;
});