const self = this;
let slideDirection = self.share.slideDirection ? self.share.slideDirection : 'left';
if (!self.loaded) {
	/*
	$('#gladiator').append(self.display.box);
	$('head').append("<style>" + self.display.style + "</style>");
	
	$('#attributes').hide(0).show('slide', {
		direction: slideDirection
	}, 250);
	*/
	new self.hook.comms();
	new self.control.events();
} else {
	/*
	$('#attributes').show('slide', {
		direction: slideDirection
	}, 250);
	*/
}