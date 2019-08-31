const self = this;

$('[name="biometricsPrevious').on('click', e => {
    self.state.previous = true;
});

$('[name="biometricsNext').on('click', e => {
    self.state.next = true;
});