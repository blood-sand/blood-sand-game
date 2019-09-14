const self = this;

self.state.mk({
	property: 'next',
	value: false,
	preset: () => {
		/*$('#skills').hide('slide', {
            direction: 'left'
        }, 250);
        self.share.slideDirection = 'right';
		modules.fetch('hmm');
		*/
	}
});

self.state.mk({
	property: 'previous',
	value: false,
	preset: () => {
		$('#combatStats').hide('slide', {
            direction: 'right'
        }, 250);
        self.share.slideDirection = 'left';
		modules.fetch('biometrics');
	}
});

let combatStatsLabels = [
	"health",
	"stamina",
	"staminaRecovery",
	"initiative",
	"nerve",
	"offense",
	"defense",
	"dodge",
	"parry"
];

socket.on("gladiator-combatStats", data => {
	console.log("stats:", data);
	combatStatsLabels.forEach(name => {
		if (name in data) {
			let val = data[name];
			console.log(name, val)
			if (/\./.test("" + val)) {
				val = val.toFixed(2);
			}
			$(`[name="${name}"]`).val(val);
		}
	});
});

socket.emit("gladiator-combatStats-ready");