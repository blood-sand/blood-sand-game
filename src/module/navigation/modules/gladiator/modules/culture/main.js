const self = this;
if (!self.loaded) {
    new self.hook.comms();
    new self.control.events();
}