const self = this;

if (!self.loaded) {
    $('head').append("<style>" + self.display.style + "</style>");
    $('#game').append(self.display.view);
    new self.control.events();
    modules.fetch('settings');
    modules.fetch('gladiator');
    modules.fetch('listGladiators');
    //console.log(self.modules);
}