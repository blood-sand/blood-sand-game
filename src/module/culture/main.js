const self = this;
if (!self.loaded) {
	console.log("first load");
	
	$('#game').append(self.display.box);
	$('head').append("<style>" + self.display.style + "</style>");

	self.hook.comms();
	self.control.events();
} else {
	$('#culture').show(50);
}
