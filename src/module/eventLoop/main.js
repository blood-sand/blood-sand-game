const self = this;

if (!self.loaded) {
    new self.control.events();
    new self.control.mouseState();
}