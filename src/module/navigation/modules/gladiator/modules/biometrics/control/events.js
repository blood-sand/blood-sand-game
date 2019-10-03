const self = this;

$('#biometrics select[name=culture]').val(self.share.culture);
$('#biometrics select[name=sex]').val(self.share.sex);
$('[name="name"]').val(self.share.name);

$('#biometrics input[name=rank]').on('change', e => {
    self.state.biometrics.rank = $(e.target).val();
    console.log('rank', self.state.biometrics.rank);
    socket.emit('gladiator-biometrics-rank', self.state.biometrics.rank);
});

$('body').on('change', '[name="culture"]', e => {
    self.state.culture = $(e.target).val();
});

$('body').on('change', '[name="sex"]', e => {
    self.state.sex = $(e.target).val();
});

$('.randomizeBiometrics').on('click', e => {
    self.state.requestBiometrics = true;
});
