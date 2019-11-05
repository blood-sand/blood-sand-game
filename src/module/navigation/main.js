// Main
constructor () {
  $('head').append('<style>' + this.display.style + '</style>');
  $('#game').append(this.display.view);

  new this.control.events();
  this.modules.fetch('accountSettings');
  this.modules.fetch('soundSettings');
  this.modules.fetch('gladiator');
  this.modules.fetch('listGladiators');
}
