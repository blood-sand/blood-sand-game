const self = this;
let slideDirection = self.share.slideDirection ? self.share.slideDirection : 'left';

if (!self.loaded) {
	$('#game').append(self.display.box);
	$('head').append("<style>" + self.display.style + "</style>");
	$('#combatStats').hide(0).show('slide', {
		direction: slideDirection
	}, 250);
	new self.hook.comms();
	new self.control.events();
} else {
	$('#combatStats').show('slide', {
		direction: slideDirection
	}, 250);
	socket.emit("gladiator-combatStats-generate");
}