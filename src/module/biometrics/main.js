const self = this;
if (!self.loaded) {
	console.log("first load of biometrics");
	$('#game').append(self.display.box);
	$('head').append("<style>" + self.display.style + "</style>");
	
	
	self.hook.comms();

	self.control.events();
	//console.log(self);
} else {
	$('#biometrics').show(50);
}
