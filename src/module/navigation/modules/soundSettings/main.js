// Main
constructor() {
  $('head').append('<style>' + this.display.style + '</style>');
  $('#game').append(this.display.view);

  this.state.dialog = $('#sound-settings-dialog');

  new this.hook.comms();
  new this.control.sliders();
  new this.control.dialog();
  new this.control.sounds();
}
