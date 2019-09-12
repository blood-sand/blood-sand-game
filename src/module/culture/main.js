const self = this;
let slideDirection = self.share.slideDirection ? self.share.slideDirection : 'left';
if (!self.loaded) {
	console.log("first load");
	self.__proto__.generateName = function generateName () {
	    if (!self.state.culture || !self.state.sex) {
	        return;
	    }
	    let ref = self.state.names[self.state.culture]
	    if (ref) {
	    	ref = ref[self.state.sex];
	    }
	    if (!ref) {
	    	return;
	    }
	    let randName = ref[Math.floor(Math.random()*ref.length)];
	    self.state.name = randName;
	};
	$('#game').append(self.display.box);
	$('head').append("<style>" + self.display.style + "</style>");
	$('select').selectric();
	new self.hook.comms();
	new self.control.events();
	
} else {
	$('#culture').show('slide', {
		direction: slideDirection
	}, 250);
}