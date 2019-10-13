const self = this;

if (!self.loaded) {
    $('head').append("<style>" + self.display.style + "</style>");
    $('#game').append(self.display.view);
    self.state.dialog = $('#user-settings-dialog');
    new self.hook.comms();
    new self.control.sliders();
    new self.control.dialog();
    new self.control.sounds();
}