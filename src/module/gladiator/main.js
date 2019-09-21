const self = this;

if (!self.loaded) {
	console.log("tabs r here!!");

	$('head').append("<style>" + self.display.style + "</style>");
	$('#game').append(self.display.view);
	new self.control.events();
}