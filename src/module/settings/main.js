const self = this;

if (!self.loaded) {
	console.log("user settings is here!!");

	$('head').append("<style>" + self.display.style + "</style>");
	$('#game').append(self.display.view);
	self.hook.comms();
	self.control.events();
}