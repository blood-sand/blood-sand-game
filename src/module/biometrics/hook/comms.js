const self = this;

self.state.mk({
	property: 'next',
	value: false,
	preset: () => {
		socket.emit('gladiator-next', {
			
		});
		$('#biometrics').hide(0);
		modules.fetch('bmi');
	}
});

self.state.mk({
	property: 'previous',
	value: false,
	preset: () => {
		socket.emit('gladiator-previous', {
			
		});
		$('#biometrics').hide(0);
		modules.fetch('attributes');
	}
});

socket.on("gladiator-biometrics", data => {
	for (let name in data) {
		$(`[name="${name}"]`).val(data[name]);
	}
});
socket.emit("gladiator-biometrics-ready");