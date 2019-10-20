// Main
const self = this;

if (!self.loaded) {
  $('head').append('<style>' + self.display.style + '</style>');
  $('#game').append(self.display.view);

  new self.control.events();
}
