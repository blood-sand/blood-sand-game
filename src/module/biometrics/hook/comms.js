const self = this;

self.state.mk({
	property: 'next',
	value: false,
	preset: () => {
		//$('#biometrics').hide(0);
		//modules.fetch('bmi');
	}
});

self.state.mk({
	property: 'previous',
	value: false,
	preset: () => {
		$('#biometrics').hide(0);
		modules.fetch('attributes');
	}
});
let biometricLabels = [
	"rank",
	"age",
	"weight",
	"height",
	"bmi",
	"reach"
];
socket.on("gladiator-biometrics", data => {
	biometricLabels.forEach(name => {
		if (name in data) {
			$(`[name="${name}"]`).val(data[name]);
		}
	});
});

socket.emit("gladiator-biometrics-ready");