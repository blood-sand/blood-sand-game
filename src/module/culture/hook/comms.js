const self = this;

const catcher = function (o, prop, val) {
	console.log(prop, "changed from", o[prop], "to", val);
	if (val !== o[prop]) {
		o[prop] = val;
		socket.emit(`gladiator-${prop}`, val);
	}
	self.share[prop] = o[prop];
	$(`[name="${prop}"]`).val(o[prop]);
	return false;
}

self.state.mk({
	property: 'next',
	value: false,
	preset: () => {
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

socket.emit("gladiator-culture-ready");
socket.on("gladiator-names", d => {
    self.state.names = d;
});
socket.on("gladiator-name", d => {
	console.log("name:", d)
	self.state.name = d;
});
socket.on("gladiator-sex", d => {
	console.log("sex:", d)
	self.state.sex = d;
});
socket.on("gladiator-culture", d => {
	console.log("culture:", d)
	self.state.culture = d;
});
socket.on("gladiator-culture-info", d => {
    self.state.cultureInfo = d;
});

