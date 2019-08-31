const self = this;

const catcher = function (o, prop, val) {
	//val = val.toLowerCase();
	console.log(prop, "changed from", o[prop], "to", val);
	if (val !== o[prop]) {
		o[prop] = val;
		socket.emit(`gladiator-${prop}`, val);
		if (prop !== "name" && !self.state.name) {
			generateName();
		}
	}
	$(`[name="${prop}"]`).val(o[prop]);
	return false;
}

self.state.mk({
	property: 'next',
	value: false,
	preset: () => {
		window.state.culture = {
			culture: self.state.culture,
			sex: self.state.sex,
			name: self.state.name
		};
		socket.emit('gladiator-next', state.culture);
		$('#culture').hide(0);
		modules.fetch('attributes');
	}
});

self.state.mk({
	property: 'culture', 
	value: $('[name="culture"]').val().toLowerCase(),
	preset: catcher
});

self.state.mk({
	property: 'sex', 
	value: $('[name="sex"]').val().toLowerCase(),
	preset: catcher
});

self.state.mk({
	property: 'name', 
	value: $('[name="name"]').val().toLowerCase(),
	preset: catcher
});

function generateName () {
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
    //$('[name="name"]').val(randName);
}

console.log("culture ready sent");
console.log(socket)
socket.emit("gladiator-culture-ready");
socket.on("gladiator-names", d => {
    self.state.names = d;
});
socket.on("gladiator-name", d => {
	self.state.name = d;
});
socket.on("gladiator-sex", d => {
	self.state.sex = d;
});
socket.on("gladiator-culture", d => {
	self.state.culture = d;
});
socket.on("gladiator-culture-info", d => {
    self.state.cultureInfo = d;
});

