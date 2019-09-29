const self = this;

$('#biometrics select[name=culture]').val(self.share.culture);
$('#biometrics select[name=sex]').val(self.share.sex);
$('[name="name"]').val(self.share.name);

$('body').on('change', '[name="culture"]', e => {
    self.state.culture = $(e.target).val();
});

$('body').on('change', '[name="sex"]', e => {
    self.state.sex = $(e.target).val();
});

$('.randomizeBiometrics').on('click', e => {
    self.state.requestBiometrics = true;
});
