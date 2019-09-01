const self = this;

const MAX_ABILITY_SUM = 91;
const MAX_STAT_SIZE = 18;
const MIN_STAT_SIZE = 3;

function randomProperty (obj, f = () => {}) {
    var keys = Object.keys(obj).filter(f);
    return  keys[keys.length * Math.random() << 0];
};

self.state.mk({
	property: 'next',
	value: false,
	preset: () => {
		//socket.emit('gladiator-next');
		$('#attributes').hide(0);
		modules.fetch('biometrics');
	}
});

self.state.mk({
	property: 'previous',
	value: false,
	preset: () => {
		//socket.emit('gladiator-previous');
		$('#attributes').hide(0)
		modules.fetch('culture');
	}
});

socket.on("gladiator-attributes", data => {
	for (let name in data) {
		$(`[name="${name}"]`).val(data[name]);
	}
	self.state.attributes = waject(data, (stats, name, value) => {
		let abilitySum = stats.abilitySum;
        
        if (name === "abilitySum") {
            if (value > MAX_ABILITY_SUM) {
                value = MAX_ABILITY_SUM;
            }
            if (value < 0) {
                value = 0;
            }
            let difference = value - stats.abilitySum;
            stats.abilitySum = value;
            if (isNaN(difference)) {
                return false;
            }
            while (difference !== 0) {
                let randProp;
                if (difference > 0) {
                    randProp = randomProperty(stats, i => {
                        if (i === "abilitySum") {
                            return false;
                        }
                        if (i === "toString") {
                        	return false;
                        }
                        if (stats[i] >= MAX_STAT_SIZE) {
                            return false;
                        }
                        return true;
                    });

                    stats[randProp] += 1;
                    difference -= 1;
                } else {
                    randProp = randomProperty(stats, i => {
                        if (i === "abilitySum") {
                            return false;
                        }
                        if (i === "toString") {
                        	return false;
                        }
                        if (stats[i] <= MIN_STAT_SIZE) {
                            return false;
                        }
                        return true;
                    });
                    stats[randProp] -= 1;
                    difference += 1;
                }
            }
            
            socket.emit("gladiator-attributes-change", stats);
            return false;
        }
        if (value < MIN_STAT_SIZE) {
            value = MIN_STAT_SIZE;
        } 

        if (value > MAX_STAT_SIZE) {
            value = MAX_STAT_SIZE;
        }
        
        let difference = value - stats[name];
        
        abilitySum += difference;
        if (abilitySum > MAX_ABILITY_SUM) {
            let overDiff = abilitySum - MAX_ABILITY_SUM;
            abilitySum = MAX_ABILITY_SUM;
            stats[name] = value - overDiff;

        } else {
            stats[name] += difference;
        }
        stats.abilitySum = abilitySum;
        socket.emit("gladiator-attributes-change", stats);
        return false;
	});
});

socket.emit("gladiator-attributes-ready");