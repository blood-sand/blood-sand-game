const self = this;

if (!self.loaded) {
    console.log("user settings is here!!");

    $('head').append("<style>" + self.display.style + "</style>");
    $('#game').append(self.display.view);
    new self.hook.comms();
    new self.control.events();
}