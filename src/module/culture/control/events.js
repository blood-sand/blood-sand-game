const self = this;

$('[name="culture"]').on('change', e => {
    self.state.culture = $(e.target).val();
});

$('[name="sex"]').on('change', e => {
    self.state.sex = $(e.target).val();
});

$('body').on('change', '[name="name"]', e => {
    self.state.name = e.target.value;
});

$('[name="cultureNext').on('click', e => {
    if (self.state.culture === "culture") {
        return;
    }
    self.state.next = true;
});