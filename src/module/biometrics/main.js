const self = this;
let slideDirection = self.share.slideDirection ? self.share.slideDirection : 'left';
if (!self.loaded) {
	console.log("first load of biometrics");
	$('#game').append(self.display.box);
	$('head').append("<style>" + self.display.style + "</style>");
	$('#biometrics').hide(0).show('slide', {
		direction: slideDirection
	}, 250);
	self.hook.comms();
	self.control.events();
	$('select').selectric();
	//console.log(self);
} else {
	$('#biometrics').show('slide', {
		direction: slideDirection
	}, 250);
}
