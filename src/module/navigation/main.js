// Main
const self = this;

if (!self.loaded) {
  $('head').append('<style>' + self.display.style + '</style>');
  $('#game').append(self.display.view);

  new self.control.events();
  self.modules.fetch('settings');
  self.modules.fetch('gladiator');
  self.modules.fetch('listGladiators');
}
