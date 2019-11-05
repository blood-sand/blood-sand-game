
constructor () {
  $('head').append('<style>' + this.display.style + '</style>');
  $('#game').append(this.display.view);

  this.state.dialog = $('#account-settings-dialog');

  new this.hook.comms;
  new this.control.dialog;
  new this.control.login;
  new this.control.edit;
}