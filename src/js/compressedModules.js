window.modules = {
	share: {},
	fetch: function (name) {
		let m = new modules[name];
		modules[name].prototype.loaded = true;
		return m;
	}
};
modules.attributes = function () {
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
};
modules.attributes.prototype.state = waject();
modules.attributes.prototype.share = modules.share;
modules.attributes.prototype.loaded = false;
modules.attributes.prototype.control={};
modules.attributes.prototype.control.events=function() {
	const self = this;
	
	if (self.share.name) {
		$('[name="name"]').val(self.share.name);
	}
	$('[name="attributesPrevious').on('click', e => {
	    self.state.previous = true;
	});
	$('[name="attributesNext').on('click', e => {
	    self.state.next = true;
	});
	
	$( "#attributes .slider" ).slider({
		create: function() {
			$(this).children('.custom-handle').text( $(this).slider("value"));
		},
		slide: function( event, ui ) {
			$(this).children('.custom-handle').text(ui.value);
			let name = $(this).attr('name');
			if (self.state.attributes && name in self.state.attributes) {
				self.state.attributes[name] = ui.value;
			}
		},
		min: 3,
		max: 18,
		animate: 'slow'
	});
	$('#attributes [name=abilitySum]').slider('option', 'max', 91).slider('option', 'min', 21);
	
	$('#attributes .randomizeAttributes').on('click', e => {
		let abilitySum = $('#attributes [name=abilitySum]');
	
		abilitySum.slider('option', 'slide').call(abilitySum, null, {value: 21});
		setTimeout(() => {
			abilitySum.slider('option', 'slide').call(abilitySum, null, {value: 91});
		}, 700);
	});
};
modules.attributes.prototype.control.events.prototype = modules.attributes.prototype;
modules.attributes.prototype.display={};
modules.attributes.prototype.display.box=$("<div id=\"attributes\" class=\"item\"> <span> <img src=\"/img/dice.png\" class=\"randomizeAttributes dice\"> Attributes For <input name=\"name\" value=\"Name Your Gladiator\"> </span> <ul class=\"gladiatorData\"> <li> <span>strength</span> <div class=\"slider\" name=\"strength\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> </li> <li> <span>dexterity</span> <div class=\"slider\" name=\"dexterity\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> </li> <li> <span>perception</span> <div class=\"slider\" name=\"perception\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> </li> <li> <span>endurance</span> <div class=\"slider\" name=\"endurance\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> </li> <li> <span>intelligence</span> <div class=\"slider\" name=\"intelligence\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> </li> <li> <span>willpower</span> <div class=\"slider\" name=\"willpower\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> </li> <li> <span>vitality</span> <div class=\"slider\" name=\"vitality\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> </li> <li> <span>ability sum</span> <div class=\"slider\" name=\"abilitySum\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> </li> </ul> <div> <button name=\"attributesPrevious\" class=\"previous\">Previous</button> <button name=\"attributesNext\" class=\"next\">Next</button> </div> </div>");
modules.attributes.prototype.display.style="#attributes div < button[name=\"attributesNext\"] { display: block; } #attributes button[name=\"attributesPrevious\"] { display: block; float: left; } #attributes .slider { width: 480px; margin: 11.75px 40px; } #attributes .slider .custom-handle { width: 3em; height: 1.6em; top: 50%; margin-top: -.8em; margin-left: -23px; text-align: center; line-height: 1.6em; } #attributes input[name=\"name\"] { width: 57%; } #attributes button[name=\"attributesNext\"] { display: block; float: right; }";
modules.attributes.prototype.hook={};
modules.attributes.prototype.hook.comms=function() {
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
			$('#attributes').hide('slide', {
	            direction: 'left'
	        }, 250);
	        self.share.slideDirection = 'right';
			modules.fetch('biometrics');
		}
	});
	
	self.state.mk({
		property: 'previous',
		value: false,
		preset: () => {
			//socket.emit('gladiator-previous');
			$('#attributes').hide('slide', {
	            direction: 'right'
	        }, 250);
	        self.share.slideDirection = 'left';
			modules.fetch('culture');
		}
	});
	
	socket.on("gladiator-attributes", data => {
		for (let name in data) {
	        let slider = $(`[name=${name}`);
	        //console.log(slider);
	        slider.slider('value', data[name]);
	        slider.children('.custom-handle').text(data[name]);
			//$(`[name="${name}"]`).val(data[name]);
	
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
	            if (!self.state.ignoreChange) {
	                socket.emit("gladiator-attributes-change", stats);
	            } else {
	                console.log("ignoring change")
	            }
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
	        if (!self.state.ignoreChange) {
	            socket.emit("gladiator-attributes-change", stats);
	        } else {
	            console.log("ignoring change")
	        }
	        return false;
		});
	});
	
	socket.emit("gladiator-attributes-ready");
};
modules.attributes.prototype.hook.comms.prototype = modules.attributes.prototype;
modules.biometrics = function () {
	const self = this;
	let slideDirection = self.share.slideDirection ? self.share.slideDirection : 'left';
	if (!self.loaded) {
		/*
		$('#gladiator').append(self.display.box);
		$('head').append("<style>" + self.display.style + "</style>");
		$('#biometrics').hide(0).show('slide', {
			direction: slideDirection
		}, 250);
		*/
		new self.hook.comms();
		new self.control.events();
		$('select').selectric();
		//console.log(self);
	} else {
		/*$('#biometrics').show('slide', {
			direction: slideDirection
		}, 250);*/
	}
	
};
modules.biometrics.prototype.state = waject();
modules.biometrics.prototype.share = modules.share;
modules.biometrics.prototype.loaded = false;
modules.biometrics.prototype.control={};
modules.biometrics.prototype.control.events=function() {
	const self = this;
	
	$('#biometrics select[name=culture]').val(self.share.culture);
	$('#biometrics select[name=sex]').val(self.share.sex);
	$('[name="name"]').val(self.share.name);
	
	$('body').on('change', '[name="culture"]', e => {
	    self.state.culture = $(e.target).val();
	});
	
	$('body').on('change', '[name="sex"]', e => {
	    self.state.sex = $(e.target).val();
	});
	
	$('.randomizeBiometrics').on('click', e => {
		self.state.requestBiometrics = true;
	});
	
	$('[name="biometricsPrevious').on('click', e => {
	    self.state.previous = true;
	});
	
	$('[name="biometricsNext').on('click', e => {
	    self.state.next = true;
	});
};
modules.biometrics.prototype.control.events.prototype = modules.biometrics.prototype;
modules.biometrics.prototype.display={};
modules.biometrics.prototype.display.box=$("<div id=\"biometrics\" class=\"item\"> <span> <img src=\"/img/dice.png\" class=\"randomizeBiometrics dice\"> Biometrics For <input name=\"name\" value=\"Name Your Gladiator\"> </span> <ul class=\"gladiatorData\"> <li> <span>Culture</span> <select class=\"stat\" name=\"culture\"> <option disabled>culture</option> <option>roman</option> <option>gallic</option> <option>germanic</option> <option>syrian</option> <option>numidian</option> <option>thracian</option> <option>greek</option> <option>iberian</option> <option>judean</option> <option>scythian</option> </select> </li> <li> <span>Sex</span> <select class=\"stat\" name=\"sex\"> <option>male</option> <option>female</option> </select> </li> <li> <span>Rank</span> <input class=\"stat\" name=\"rank\" readonly> </li> <li> <span>Age</span> <input class=\"stat\" name=\"age\" readonly> </li> <li> <span>Weight</span> <input class=\"stat\" name=\"weight\" readonly> </li> <li> <span>Height</span> <input class=\"stat\" name=\"height\" readonly> </li> <li> <span>BMI</span> <input class=\"stat\" name=\"bmi\" readonly> </li> <li> <span>Reach</span> <input class=\"stat\" name=\"reach\" readonly> </li> </ul> <div> <button name=\"biometricsPrevious\" class=\"previous\">Previous</button> <button name=\"biometricsNext\" class=\"next\">Next</button> </div> </div>");
modules.biometrics.prototype.display.style="div < button[name=\"biometricsNext\"] { display: block; } button[name=\"biometricsPrevious\"] { display: block; float: left; } #biometrics input[name=\"name\"] { width: 50%; } #biometrics select { width: 150px; } button[name=\"biometricsNext\"] { display: block; float: right; }";
modules.biometrics.prototype.hook={};
modules.biometrics.prototype.hook.comms=function() {
	const self = this;
	
	const catcher = function (o, prop, val) {
		console.log(prop, "changed from", o[prop], "to", val);
		if (val !== o[prop]) {
			o[prop] = val;
			//socket.emit(`gladiator-${prop}`, val);
		}
		self.share[prop] = o[prop];
		$(`[name="${prop}"]`).val(o[prop]);
		return false;
	}
	
	self.state.mk({
		property: 'next',
		value: false,
		preset: () => {
			$('#biometrics').hide('slide', {
	            direction: 'left'
	        }, 250);
	        self.share.slideDirection = 'right';
			modules.fetch('combatStats');
		}
	});
	
	self.state.mk({
		property: 'previous',
		value: false,
		preset: () => {
			$('#biometrics').hide('slide', {
	            direction: 'right'
	        }, 250);
	        self.share.slideDirection = 'left';
			modules.fetch('attributes');
		}
	});
	
	self.state.mk({
		property: 'culture',
		value: self.share.culture,
		preset: catcher
	});
	
	self.state.mk({
		property: 'sex',
		value: self.share.sex,
		preset: catcher
	});
	
	self.state.mk({
		property: 'requestBiometrics',
		value: false,
		preset: (o, prop, val) => {
			if (val) {
				console.log("requesting biometrics..");
				socket.emit("gladiator-biometrics-generate");
				return false;
			}
		}
	})
	
	let biometricLabels = [
		"rank",
		"age",
		"weight",
		"height",
		"bmi",
		"reach"
	];
	
	self.state.biometrics = {
		rank: 0,
		age: 0,
		weight: 0,
		height: 0,
		bmi: 0,
		reach: 0
	};
	
	socket.on("gladiator-biometrics", data => {
		biometricLabels.forEach(name => {
			if (name in data) {
				let val = data[name];
				console.log(name, val)
				if (/\./.test("" + val)) {
					val = val.toFixed(2);
				}
				self.state.biometrics[name] = val;
				$(`[name="${name}"]`).val(val);
			}
		});
	});
	
	//console.log(self.share);
	
	socket.emit("gladiator-biometrics-ready");
};
modules.biometrics.prototype.hook.comms.prototype = modules.biometrics.prototype;
modules.combatStats = function () {
	const self = this;
	let slideDirection = self.share.slideDirection ? self.share.slideDirection : 'left';
	
	if (!self.loaded) {
		/*
		$('#gladiator').append(self.display.box);
		$('head').append("<style>" + self.display.style + "</style>");
		$('#combatStats').hide(0).show('slide', {
			direction: slideDirection
		}, 250);
		*/
		new self.hook.comms();
		new self.control.events();
	} else {
		/*$('#combatStats').show('slide', {
			direction: slideDirection
		}, 250);*/
		socket.emit("gladiator-combatStats-generate");
	}
};
modules.combatStats.prototype.state = waject();
modules.combatStats.prototype.share = modules.share;
modules.combatStats.prototype.loaded = false;
modules.combatStats.prototype.control={};
modules.combatStats.prototype.control.events=function() {
	const self = this;
	
	$('#combatStats [name=name]').val(self.share.name);
	$('[name="combatStatsPrevious').on('click', e => {
	    self.state.previous = true;
	});
	
	$('[name="combatStatsNext').on('click', e => {
	    self.state.next = true;
	});
};
modules.combatStats.prototype.control.events.prototype = modules.combatStats.prototype;
modules.combatStats.prototype.display={};
modules.combatStats.prototype.display.box=$("<div id=\"combatStats\" class=\"item\"> <span> Combat Statistics For <input name=\"name\" value=\"Name Your Gladiator\"> </span> <ul class=\"gladiatorData\"> <li> <span>Health</span> <input type=\"number\" class=\"stat\" name=\"health\" readonly> </li> <li> <span>Stamina</span> <input type=\"number\" class=\"stat\" name=\"stamina\" readonly> </li> <li> <span>Stamina Recovery</span> <input type=\"number\" class=\"stat\" name=\"staminaRecovery\" readonly> </li> <li> <span>Initiative</span> <input type=\"number\" class=\"stat\" name=\"initiative\" readonly> </li> <li> <span>Nerve</span> <input type=\"number\" class=\"stat\" name=\"nerve\" readonly> </li> <li> <span>Offense</span> <input type=\"number\" class=\"stat\" name=\"offense\" readonly> </li> <li> <span>Defense</span> <input type=\"number\" class=\"stat\" name=\"defense\" readonly> </li> <li> <span>Dodge</span> <input type=\"number\" class=\"stat\" name=\"dodge\" readonly> </li> <li> <span>Parry</span> <input type=\"number\" class=\"stat\" name=\"parry\" readonly> </li> </ul> <div> <button name=\"combatStatsPrevious\" class=\"previous\">Previous</button> <button name=\"combatStatsNext\" class=\"next\">Next</button> </div> </div>");
modules.combatStats.prototype.display.style="div < button[name=\"combatStatsNext\"] { display: block; } button[name=\"combatStatsPrevious\"] { display: block; float: left; } #combatStats input[name=\"name\"] { width: 50%; } #combatStats select { width: 150px; } button[name=\"combatStatsNext\"] { display: block; float: right; }";
modules.combatStats.prototype.hook={};
modules.combatStats.prototype.hook.comms=function() {
	const self = this;
	
	self.state.mk({
		property: 'next',
		value: false,
		preset: () => {
			$('#combatStats').hide('slide', {
	            direction: 'left'
	        }, 250);
	        self.share.slideDirection = 'right';
			modules.fetch('skills');
			
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
};
modules.combatStats.prototype.hook.comms.prototype = modules.combatStats.prototype;
modules.culture = function () {
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
		//$('#gladiator').append(self.display.box);
		//$('head').append("<style>" + self.display.style + "</style>");
		$('select').selectric();
		new self.hook.comms();
		new self.control.events();
		
	} else {
		$('#culture').show('slide', {
			direction: slideDirection
		}, 250);
	}
};
modules.culture.prototype.state = waject();
modules.culture.prototype.share = modules.share;
modules.culture.prototype.loaded = false;
modules.culture.prototype.control={};
modules.culture.prototype.control.events=function() {
	const self = this;
	
	function getRandomInt(min, max) {
	    min = Math.ceil(min);
	    max = Math.floor(max);
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	const sexes = [
	    "male",
	    "female"
	];
	const cultures = [
	    "roman",
	    "gallic",
	    "germanic",
	    "syrian",
	    "numidian",
	    "thracian",
	    "greek",
	    "iberian",
	    "judean",
	    "scythian"
	];
	
	$('body').on('change', '[name="culture"]', e => {
	    self.state.culture = $(e.target).val();
	});
	
	$('body').on('change', '[name="sex"]', e => {
	    self.state.sex = $(e.target).val();
	});
	
	$('body').on('change', '[name="name"]', e => {
	    self.state.name = e.target.value;
	});
	$('body').on('click', '.randomizeName', e => {
		self.generateName();
	});
	$('body').on('click', '.randomizeCulture', e => {
		let randCulture = getRandomInt(0, 9);
		let randSex = getRandomInt(0, 1);
		console.log(randCulture, cultures[randCulture]);
		console.log(randSex, sexes[randSex]);
		self.state.culture = cultures[randCulture];
		self.state.sex = sexes[randSex];
		self.generateName();
	});
	$('[name="cultureNext').on('click', e => {
	    if (self.state.culture === "culture") {
	        return;
	    }
	    self.state.next = true;
	});
};
modules.culture.prototype.control.events.prototype = modules.culture.prototype;
modules.culture.prototype.display={};
modules.culture.prototype.display.box=$("<div id=\"culture\" class=\"item\"> <span> <img src=\"/img/dice.png\" class=\"randomizeCulture dice\"> Create Gladiator <input name=\"name\" value=\"Name Your Gladiator\"> </span> <ul class=\"gladiatorData\"> <li> <span>Culture</span> <select class=\"stat\" name=\"culture\"> <option>roman</option> <option>gallic</option> <option>germanic</option> <option>syrian</option> <option>numidian</option> <option>thracian</option> <option>greek</option> <option>iberian</option> <option>judean</option> <option>scythian</option> </select> </li> <li> <span>Sex</span> <select class=\"stat\" name=\"sex\"> <option>male</option> <option>female</option> </select> </li> <li> <span> Name <img src=\"/img/dice.png\" class=\"randomizeName dice\"> </span> <input class=\"stat\" name=\"name\"> </li> </ul> <div> <button name=\"cultureNext\" class=\"next\">Next</button> </div> </div>");
modules.culture.prototype.display.style="div < button[name=\"cultureNext\"] { display: block; } #culture input[name=\"name\"] { width: 450px; } button[name=\"cultureNext\"] { display: block; float:right; }";
modules.culture.prototype.hook={};
modules.culture.prototype.hook.comms=function() {
	const self = this;
	
	const catcher = function (o, prop, val) {
		console.log(prop, "changed from", o[prop], "to", val);
		if (val !== o[prop]) {
			o[prop] = val;
			socket.emit(`gladiator-${prop}`, val);
		}
		self.share[prop] = o[prop];
		$(`[name="${prop}"]`).val(o[prop]);
		if ($(`[name="${prop}"]`).is('select')) {
			$(`[name="${prop}"]`).selectric();
		}
		return false;
	}
	
	self.state.mk({
		property: 'next',
		value: false,
		preset: () => {
			$('#culture').toggle('slide', 250);
			self.share.slideDirection = 'right';
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
	
	self.share.culture = self.state.culture;
	self.share.sex = self.state.sex;
	self.share.name = self.state.name;
	
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
	
	
};
modules.culture.prototype.hook.comms.prototype = modules.culture.prototype;
modules.gladiator = function () {
	const self = this;
	
	if (!self.loaded) {
		console.log("tabs r here!!");
	
		$('head').append("<style>" + self.display.style + "</style>");
		$('#game').append(self.display.view);
		new self.control.events();
	}
};
modules.gladiator.prototype.state = waject();
modules.gladiator.prototype.share = modules.share;
modules.gladiator.prototype.loaded = false;
modules.gladiator.prototype.control={};
modules.gladiator.prototype.control.events=function() {
	
	$('#gladiator ul>li').each(function () {
		let id = $(this).children('a').attr('href').replace('#', '');
		$('head').append('<style>' + modules[id].prototype.display.style + '</style>');
		$('#gladiator').append(modules[id].prototype.display.box);
		modules.fetch(id);
		console.log(modules[id].prototype)
	});
	let baseHeight = $('#gladiator ul').height();
	console.log(baseHeight)
	modules.fetch('culture');
	$('#gladiator').css({
		'height': $('#culture').outerHeight(),
		'width': $('#culture').outerWidth()
	});
	$('#gladiator').tabs({
		activate (event, ui) {
			//console.log(ui);
			let id = ui.newPanel.attr('id').replace('#', '');
			modules.fetch(id);
			$('#gladiator').css({
				'height': ui.newPanel.outerHeight(),
				'width': ui.newPanel.outerWidth()
			});
		}
	});
};
modules.gladiator.prototype.control.events.prototype = modules.gladiator.prototype;
modules.gladiator.prototype.display={};
modules.gladiator.prototype.display.style="#gladiator { overflow: hidden; }";
modules.gladiator.prototype.display.view=$("<div id=\"gladiator\"> <ul> <li><a href=\"#culture\">Culture</a></li> <li><a href=\"#attributes\">Attributes</a></li> <li><a href=\"#biometrics\">Biometrics</a></li> <li><a href=\"#combatStats\">Combat Stats</a></li> <li><a href=\"#skills\">Skills</a></li> </ul> </div>");
modules.settings = function () {
	const self = this;
	
	if (!self.loaded) {
		console.log("user settings is here!!");
	
		$('head').append("<style>" + self.display.style + "</style>");
		$('#game').append(self.display.view);
		new self.hook.comms();
		new self.control.events();
	}
};
modules.settings.prototype.state = waject();
modules.settings.prototype.share = modules.share;
modules.settings.prototype.loaded = false;
modules.settings.prototype.control={};
modules.settings.prototype.control.events=function() {
	const self = this;
	let dialog = $('#user-settings-dialog');
	dialog.dialog({
		autoOpen: false,
		modal: true,
		width: 720,
		show: {
			effect: 'explode',
			duration: 250
		}, 
		hide: {
			effect: 'explode',
			duration: 250
		},
		close: function() {
			self.share.sounds.bow.play();
			self.state.masterSound = $(this).find('[name=master-sound]').slider('value');
			self.state.masterVolume = $(this).find('[name=master-volume]').slider('value');
			self.state.musicVolume = $(this).find('[name=music-volume]').slider('value');
			self.state.fxVolume = $(this).find('[name=fx-volume]').slider('value');
			//self.state.sound = sound;
		},
		open: function () {
			self.share.sounds.switch.play();
			$('.ui-widget-overlay').one('click', () => $(this).dialog('close'));
		}
	});
	
	
	let masterSoundOn = $('#user-settings-dialog .slider[name=master-sound]').slider({
		value: 0,
		min: 0,
		max: 1,
		step: 1,
		create: function() {
			let value = $(this).slider('value');
			$(this).children('.custom-handle').text(value ? 'On' : 'Off');
		},
		slide: function (event, ui) {
			$(this).children(".custom-handle").text(ui.value ? 'On' : 'Off');
			self.state.masterSound = ui.value;
		},
		animate: 'fast'
	});
	
	let masterVolume = $('#user-settings-dialog .slider[name=master-volume]').slider({
		value: 80,
		min: 0,
		max: 100,
		step: 5,
		create: function() {
			//let value = $(this).slider('value');
			//$(this).children('.custom-handle').text(value ? 'On' : 'Off');
		},
		slide: function (event, ui) {
			//$(this).children(".custom-handle").text(ui.value ? 'On' : 'Off');
			self.state.masterVolume = ui.value;
		},
		animate: 'fast'
	});
	
	let musicVolume = $('#user-settings-dialog .slider[name=music-volume]').slider({
		value: 80,
		min: 0,
		max: 100,
		step: 5,
		create: function() {
			//let value = $(this).slider('value');
			//$(this).children('.custom-handle').text(value ? 'On' : 'Off');
		},
		slide: function (event, ui) {
			//$(this).children(".custom-handle").text(ui.value ? 'On' : 'Off');
			self.state.musicVolume = ui.value;
		},
		animate: 'fast'
	});
	
	let fxVolume = $('#user-settings-dialog .slider[name=fx-volume]').slider({
		value: 80,
		min: 0,
		max: 100,
		step: 5,
		create: function() {
			//let value = $(this).slider('value');
			//$(this).children('.custom-handle').text(value ? 'On' : 'Off');
		},
		slide: function (event, ui) {
			//$(this).children(".custom-handle").text(ui.value ? 'On' : 'Off');
			self.state.fxVolume = ui.value;
		},
		animate: 'fast'
	});
	
	$('body').on('click', '.user-settings-btn', function (e) {
		//self.share.sounds.stone.currentTime = 0;
		//self.share.sounds.stone.play();
		dialog.dialog('open');
	});
	
	$('body').on('click', '.next,.previous', () => {
		self.share.sounds.switch.play();
	});
	
	$('body').on('selectric-before-open', 'select', () => {
		self.share.sounds.up.play();
	});
	
	$('body').on('selectric-before-close', 'select', () => {
		self.share.sounds.down.play();
	});
	
	$('body').on('slide', '.slider', function (e, ui) {
		let before = $(this).slider('value');
		let after = ui.value;
		if (before < after && !self.share.sounds.up.playing()) {
			self.share.sounds.up.play();
		} else if (before > after && !self.share.sounds.down.playing()) {
			self.share.sounds.down.play();
		}
		console.log('slide..',$(this).slider('value'), ui.value);
	})
	
	$('body').on('click', '.dice', () => {
		function randomDie () {
		    return 1 + (3 * Math.random() << 0);
		};
		let r = randomDie();
		let sound = self.share.sounds["dice" + r];
		//console.log('sound:', r, sound);
		sound.play();
	});
};
modules.settings.prototype.control.events.prototype = modules.settings.prototype;
modules.settings.prototype.display={};
modules.settings.prototype.display.style=".user-settings-btn { width: 64px; height: 64px; padding: 0 0; margin: 0 0; display: block; position: absolute; right: 0px; top: 0px; background: rgba(255,255,255,0.5); border-radius: 64px; border: 1px outset rgb(255,255,255,0.5); cursor: pointer; } .user-settings-btn:hover { border: 1px outset rgb(255,255,255,1); } .user-settings-btn:active { border: 1px inset rgb(255,255,255,1); } #user-settings-dialog { width:420px; display: none; background: rgb(0,0,0,0.72); } #user-settings-dialog .note { font-size: 12px; color: #848484; font-family: arial; text-shadow: 0px 0px 0px rgba(255,255,255,0.72); } #user-settings-dialog [name=master-sound] { width: 60px; margin: 11.75px 40px; } #user-settings-dialog [name=master-volume], #user-settings-dialog [name=music-volume], #user-settings-dialog [name=fx-volume] { width: 360px; margin: 11.75px 40px; } #user-settings-dialog .slider .custom-handle { width: 3em; height: 1.6em; top: 50%; margin-top: -.8em; margin-left: -30px; text-align: center; line-height: 1.6em; } ul.userData { list-style: none; background-color: rgba(164, 148, 105, 0.36); margin: 50px 0; padding: 10px; border: 0.5px outset rgba(170, 130, 25, 0.32); border-radius: 3px; } ul.userData>li { display: flex; flex-direction: row; box-shadow: 2px 2px 5px rgba(0,0,0, 0.32); padding: 5px; margin: 5px; background: rgba(0, 0, 0, 0.32); } ul.userData>li>span { padding-top: 6px; flex: 2; }";
modules.settings.prototype.display.view=$("<div class=\"user-settings-btn\"> <img src=\"/img/cog.svg\" width=\"64px\" height=\"64px\"> </div> <div id=\"user-settings-dialog\" title=\"Settings\"> <h2>Sound Settings</h2> <ul class=\"userData\"> <li> <span>Master Sound</span> <div class=\"slider\" name=\"master-sound\"> <div class=\"ui-slider-handle custom-handle\"> Off </div> </div> </li> <li> <span>Master Volume</span> <div class=\"slider\" name=\"master-volume\"> </div> </li> <li> <span>Music Volume</span> <div class=\"slider\" name=\"music-volume\"> </div> </li> <li> <span>Sound FX Volume</span> <div class=\"slider\" name=\"fx-volume\"> </div> </li> </ul> </div>");
modules.settings.prototype.hook={};
modules.settings.prototype.hook.comms=function() {
	const self = this;
	let settings = {
		masterSound: null,
		masterVolume: 100
	};
	Howler.mute(true);
	let sounds = self.share.sounds = {
		music: new Howl({
			src: ['/sound/Paint_the_Arena_with_Red.mp3'],
			loop: true,
			autoplay: true,
			volume: 0.5
		}),
		forward: new Howl({
			src: ['/sound/harp_2.mp3']
		}),
		back: new Howl({
			src: ['/sound/harp_1.mp3']
		}),
		up: new Howl({
			src: ['/sound/stone_scraping_1.mp3']
		}),
		down: new Howl({
			src: ['/sound/stone_scraping_2.mp3']
		}),
		switch: new Howl({
			src: ['/sound/stone_6.mp3']
		}),
		dice1: new Howl({
			src: ['/sound/stone_2.mp3']
		}),
		dice2: new Howl({
			src: ['/sound/stone_3.mp3']
		}),
		dice3: new Howl({
			src: ['/sound/stone_4.mp3']
		}),
		bow: new Howl({
			src: ['/sound/fire_bow_sound-mike-koenig.mp3']
		})
	};
	
	
	self.state.mk({
		property: 'masterSound',
		value: null,
		preset: (o, name, val) => {
			if (val !== o[name] && val === 0 || val === 1) {
				settings.masterSound = val;
				if (val) {
					Howler.mute(false);
				}
				if (!val) {
					Howler.mute(true);
				}
				let element = $('#user-settings-dialog [name=master-sound]');
				
				console.log("master sound", val, element.find('.custom-handle').text(), o[name])
				if (o[name] === null && val && element.find('.custom-handle').text() === "Off") {
					//console.log("Fixing slider")
					element.slider('value', settings.masterSound);
					element.find('.custom-handle').text(settings.masterSound ? 'On' : 'Off');
				}
				socket.emit('sound-settings', settings);
				
				return true;
			}
			
			return false;
		}
	});
	
	self.state.mk({
		property: 'masterVolume',
		value: null,
		preset: (o, name, val) => {
			if (val !== o[name] && val >= 0 && val <= 100) {
				settings.masterVolume = val;
				Howler.volume(val / 100);
				/*if (val > o[name]) {
					sounds.up.play();
				} else {
					sounds.down.play();
				}*/
				//console.log('volume:', val/100)
				socket.emit('sound-settings', settings);
				return true;
			}
			
			return false;
		}
	});
	self.state.mk({
		property: 'musicVolume',
		value: null,
		preset: (o, name, val) => {
			if (val !== o[name] && val >= 0 && val <= 100) {
				settings.musicVolume = val;
				sounds.music.volume(val / 100);
				/*if (val > o[name]) {
					sounds.up.play();
				} else {
					sounds.down.play();
				}*/
				socket.emit('sound-settings', settings);
				return true;
			}
			
			return false;
		}
	});
	self.state.mk({
		property: 'fxVolume',
		value: null,
		preset: (o, name, val) => {
			if (val !== o[name] && val >= 0 && val <= 100) {
				settings.fxVolume = val;
				for (let sound in sounds) {
					if (sound === "music") {
						continue;
					}
					sounds[sound].volume(val / 100);
				}
				/*if (val > o[name]) {
					sounds.up.play();
				} else {
					sounds.down.play();
				}*/
				socket.emit('sound-settings', settings);
				return true;
			}
			
			return false;
		}
	});
	socket.on('sound-settings', serverSettings => {
		settings = serverSettings;
		for (let label in settings) {
			if (settings[label] === null) {
				$('#user-settings-dialog').dialog('open');
				return;
			}
		}
		self.state.masterSound = settings.masterSound;
		self.state.masterVolume = settings.masterVolume;
		self.state.musicVolume = settings.musicVolume;
		self.state.fxVolume = settings.fxVolume;
		$('[name=master-volume').slider('value', settings.masterVolume);
		$('[name=music-volume').slider('value', settings.musicVolume);
		$('[name=fx-volume').slider('value', settings.fxVolume);
		
	});
	
	socket.emit("sound-settings-ready")
};
modules.settings.prototype.hook.comms.prototype = modules.settings.prototype;
modules.skills = function () {
	const self = this;
	let slideDirection = self.share.slideDirection ? self.share.slideDirection : 'left';
	
	if (!self.loaded) {
		/*
		$('#gladiator').append(self.display.box);
		$('head').append("<style>" + self.display.style + "</style>");
		$('#skills').hide(0).show('slide', {
			direction: slideDirection
		}, 250);
		*/
		new self.hook.comms();
		new self.control.events();
	} else {
		/*
		$('#skills').show('slide', {
			direction: slideDirection
		}, 250);
		*/
		self.state.regenerateSkills();
	}
	
};
modules.skills.prototype.state = waject();
modules.skills.prototype.share = modules.share;
modules.skills.prototype.loaded = false;
modules.skills.prototype.control={};
modules.skills.prototype.control.events=function() {
	const self = this;
	
	$('#skills [name=name]').val(self.share.name);
	
	$( "#skills .slider" ).slider({
		create: function() {
			let name = $(this).attr('name');
			let max = self.share.skillMaxes[name];
			$(this).slider('option', 'max', max);
			$(this).children('.custom-handle').text( $(this).slider("value"));
		},
		slide: function( event, ui ) {
			
			let name = $(this).attr('name');
			let max = $(this).slider('option', 'max');
			let highestPoint = self.state.skillPoints + $(this).slider('value');
			let skillCeiling = (modules.biometrics.prototype.state.biometrics.rank || 0) * 2
			console.log("current value:", $(this).slider('value'));
			console.log("new value", ui.value);
			console.log("max", max);
			console.log('available points:', self.state.skillPoints);
			console.log('skill ceiling', skillCeiling);
			if (skillCeiling < highestPoint) {
				highestPoint = skillCeiling;
			}
			if (max < highestPoint) {
				highestPoint = max;
			}
			
			if (ui.value > highestPoint) {
				ui.value = highestPoint;
			}
			console.log('highest', highestPoint, 'val', ui.value);
			$(this).children('.custom-handle').text(ui.value);
			console.log("skills:", self.state.skills)
			if (self.state.skills && name in self.state.skills) {
				self.state.skills[name] = ui.value;
			}
			if (ui.value !== self.state.skills[name]) {
				ui.value = self.state.skills[name];
				$(this).children('.custom-handle').text(ui.value);
				return false;
			}
		},
		stop: function (event, ui) {
			let name = $(this).attr('name');
			console.log("stop", ui.value, self.state.skills[name]);
			if (ui.value !== self.state.skills[name]) {
				$(this).slider('option', 'value', self.state.skills[name]);
			}
		},
		min: 0,
		max: 16,
		animate: 'slow'
	});
	
	
	$('[name="skillsPrevious').on('click', e => {
	    self.state.previous = true;
	});
	
	$('[name="skillsNext').on('click', e => {
	    self.state.next = true;
	});
};
modules.skills.prototype.control.events.prototype = modules.skills.prototype;
modules.skills.prototype.display={};
modules.skills.prototype.display.box=$("<div id=\"skills\" class=\"item\"> <span> <!-- <img src=\"/img/dice.png\" class=\"randomizeSkills dice\"> --> Skills For <input name=\"name\" value=\"Name Your Gladiator\"> </span> <div> <span>Skill Points:</span> <span name=\"skillPoints\">10</span> </div> <ul class=\"gladiatorData\"> <li> <span>tactics</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"tactics\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\">n</span> <span class=\"description\">Abyssmal</span> </li> <li> <span>dodge</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"dodge\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>parry</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"parry\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>shield</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"shield\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>bash</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"bash\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>charge</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"charge\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>spear</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"spear\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>light Blade</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"lightBlade\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>heavy Blade</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"heavyBlade\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>bludgeoning</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"bludgeoning\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>axe</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"axe\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>riposte</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"riposte\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>close Combat</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"closeCombat\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>feint</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"feint\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>dirty Trick</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"dirtyTrick\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>appraise</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"appraise\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> </ul> <div> <button name=\"skillsPrevious\" class=\"previous\">Previous</button> <button name=\"skillsNext\" class=\"next\" disabled>Next</button> </div> </div>");
modules.skills.prototype.display.style="#skills div < button[name=\"skillsNext\"] { display: block; } #skills button[name=\"skillsPrevious\"] { display: block; float: left; } #skills .slider { width: 200px; margin: 11.75px 40px; } #skills .slider .custom-handle { width: 3em; height: 1.6em; top: 50%; margin-top: -.8em; margin-left: -23px; text-align: center; line-height: 1.6em; } #skills input[name=\"name\"] { width: 57%; } #skills button[name=\"skillsNext\"] { display: block; float: right; color: rgba(255,255,255,0.72); } #skills .proficiency { text-align: center; } #skills .slider-container { color: rgba(170, 130, 25, 0.5); background: rgba(0, 0, 0, 0.32); border: 1px inset rgba(0,0,0,0.72); padding-left: 5px; padding-right: 5px; display: flex; flex-direction: row; width: 350px; } #skills .min { text-align: right; } #skills .max { text-align: left; } #skills .max, #skills .min { flex-grow: 0; padding-top: 8px; } #skills ul.gladiatorData>li>span:nth-child(1) { flex-grow: 3; }";
modules.skills.prototype.hook={};
modules.skills.prototype.hook.comms=function() {
	const self = this;
	let skillCeiling = 16;
	let totalSkillPoints = 0;
	
	self.state.mk({
		property: 'next',
		value: false,
		preset: () => {
			$('#skills').hide('slide', {
	            direction: 'left'
	        }, 250);
	        self.share.slideDirection = 'right';
			modules.fetch('combatStats');
		}
	});
	
	self.state.mk({
		property: 'previous',
		value: false,
		preset: () => {
			$('#skills').hide('slide', {
	            direction: 'right'
	        }, 250);
	        self.share.slideDirection = 'left';
			modules.fetch('combatStats');
		}
	});
	
	self.state.mk({
		property: "skillPoints",
		value: totalSkillPoints,
		preset: (o, name, val) => {
			if (val > -1) {
				$('#skills [name=skillPoints]').text(val);
				return true;
			}
			return false;
		}
	});
	
	self.state.mk({
		property: "skillCeiling",
		value: modules.biometrics.prototype.state.biometrics.rank * 2,
	});
	
	self.state.regenerateSkills = function () {
		for (let label in skills) {
			let val = self.state.skills[label];
			if (label === "tactics") { 
				$(`#skills .slider-container:has([name=${label}])`).
					siblings('.proficiency').text(val.toFixed(2));
					setDescription(label, val);
				continue;
			}
			let result = generateSkills(skillLabels.indexOf(label), val);
			$(`#skills .slider-container:has([name=${label}])`).
				siblings('.proficiency').text(result.skillfinal.toFixed(2));
			setDescription(label, result.skillfinal);
		}
	}
	
	function setDescription (skill, val) {
		let desc = "Terrible";
		if (val > 10) {
			desc = "Bad";
		}
		if (val > 20) {
			desc = "Okay";
		}
		if (val > 30) {
			desc = "decent";
		}
		if (val > 40) {
			desc = "good";
		}
		if (skill === "tactics") {
			if (val > 1) {
				desc = "Bad";
			}
		}
		$(`#skills .slider-container:has([name=${skill}])`).siblings('.description').text(desc);
	}
	
	function generateSkills (skill, val) {
		let attr = modules.attributes.prototype.state.attributes;
		let biometrics = modules.biometrics.prototype.state.biometrics;
		if (!attr || !biometrics) {
			return {
				skillfinal: 0,
				skillmax: 16
			};
		}
		let generator = {
			"input": {
				"skill": skill,
				"skillpointsspent": val,
				"skillvalue": 0,
				"dexterity": attr.dexterity,
				"endurance": attr.endurance,
				"perception": attr.perception,
				"strength": attr.strength,
				"vitality": attr.vitality,
				"willpower": attr.willpower,
				"intelligence": attr.intelligence,
				"rank": biometrics.rank,
				"tacticspoints": self.state.skills.tactics
			},
	
			"skill": "input.skill",
			"skillpointsspent": "input.skillpointsspent",
			"skillvalue": "input.skillvalue",
			"tactics": "0.1*(input.intelligence+input.rank/10*20)/2*input.tacticspoints",
	
			"dodgemod": "0.1+(0.9*(input.dexterity+input.perception)/30)+0.15*tactics/15",
			"parrymod": "0.1+(0.9*(input.strength+input.dexterity+input.perception+input.intelligence)/60)+0.15*tactics/15",
			"shieldmod": "0.1+(0.9*(input.strength+input.endurance)/30)+0.15*tactics/15",
			"bashmod": "0.1+(0.9*(input.strength+input.dexterity)/30)+0.15*tactics/15",
			"chargemod": "0.1+(0.9*(input.strength+input.dexterity)/30)+0.15*tactics/15",
			"spearsmod": "0.05+(0.95*(input.strength+input.dexterity+input.perception)/45)+0.2*tactics/15",
			"lightbladesmod": "0.05+(0.85*(input.dexterity+input.perception)/30)+0.3*tactics/15",
			"heavybladesmod": "(0.85*(input.strength+input.endurance)/30)+0.4*tactics/15",
			"bludgeoningmod": "0.2+(1*(input.strength+input.endurance+input.willpower)/45)",
			"axesmod": "0.05+(0.95*(input.strength+input.endurance+input.perception)/45)+0.2*tactics/15",
			"ripostemod": "0.1+(0.8*(input.dexterity+input.perception+input.intelligence)/45)+0.3*tactics/15",
			"closecombatmod": "0.2+(0.85*(input.strength+input.dexterity+input.perception+input.endurance)/60)+0.15*tactics/15",
			"feintmod": "0.2+(0.65*(input.dexterity+input.intelligence)/30)+0.35*tactics/15",
			"dirtytricksmod": "0.2+1*(input.dexterity+input.perception+2*input.intelligence)/60",
			"appraisemod": "0.2+0.7*(input.perception+input.intelligence)/30+0.3*tactics/15",
	
			"skilltype if skill is 0": "0",
			"skilltype if skill is 1": "0",
			"skilltype if skill is 2": "1",
			"skilltype if skill is 3": "2",
			"skilltype if skill is 4": "2",
			"skilltype if skill is 5": "1",
			"skilltype if skill is 6": "1",
			"skilltype if skill is 7": "0",
			"skilltype if skill is 8": "0",
			"skilltype if skill is 9": "0",
			"skilltype if skill is 10": "1",
			"skilltype if skill is 11": "0",
			"skilltype if skill is 12": "2",
			"skilltype if skill is 13": "1",
			"skilltype if skill is 14": "1",
	
			"skillmax if skilltype is 0": "16",
			"skillmax if skilltype is 1": "12",
			"skillmax if skilltype is 2": "8",
	
			"skillvalue if skilltype is 0": {
				"value if parent.skillpointsspent is 0": 0 ,
				"value if parent.skillpointsspent is 1": 9 ,
				"value if parent.skillpointsspent is 2": 17.5 ,
				"value if parent.skillpointsspent is 3": 25.5 ,
				"value if parent.skillpointsspent is 4": 33 ,
				"value if parent.skillpointsspent is 5": 40 ,
				"value if parent.skillpointsspent is 6": 46.5 ,
				"value if parent.skillpointsspent is 7": 52.5 ,
				"value if parent.skillpointsspent is 8": 58 ,
				"value if parent.skillpointsspent is 9": 63 ,
				"value if parent.skillpointsspent is 10": 67.5 ,
				"value if parent.skillpointsspent is 11": 71.5 ,
				"value if parent.skillpointsspent is 12": 75 ,
				"value if parent.skillpointsspent is 13": 78 ,
				"value if parent.skillpointsspent is 14": 80.5 ,
				"value if parent.skillpointsspent is 15": 82.5 ,
				"value if parent.skillpointsspent is 16": 84 
			},
			"skillvalue if skilltype is 1": {
				"value if parent.skillpointsspent is 0": 0 ,
				"value if parent.skillpointsspent is 1": 12.01 ,
				"value if parent.skillpointsspent is 2": 23.11 ,
				"value if parent.skillpointsspent is 3": 33.3 ,
				"value if parent.skillpointsspent is 4": 42.58 ,
				"value if parent.skillpointsspent is 5": 50.95 ,
				"value if parent.skillpointsspent is 6": 58.41 ,
				"value if parent.skillpointsspent is 7": 64.96 ,
				"value if parent.skillpointsspent is 8": 70.6 ,
				"value if parent.skillpointsspent is 9": 75.33 ,
				"value if parent.skillpointsspent is 10": 79.15 ,
				"value if parent.skillpointsspent is 11": 82.06 ,
				"value if parent.skillpointsspent is 12": 84.06 
			},
			"skillvalue if skilltype is 2": {
				"value if parent.skillpointsspent is 0": 0 ,
				"value if parent.skillpointsspent is 1": 18.05 ,
				"value if parent.skillpointsspent is 2": 33.95 ,
				"value if parent.skillpointsspent is 3": 47.7 ,
				"value if parent.skillpointsspent is 4": 59.3 ,
				"value if parent.skillpointsspent is 5": 68.75 ,
				"value if parent.skillpointsspent is 6": 76.05 ,
				"value if parent.skillpointsspent is 7": 81.2 ,
				"value if parent.skillpointsspent is 8": 84.2 
			},
			"skillfinal if skill is 0": "dodgemod*skillvalue",
			"skillfinal if skill is 1": "parrymod*skillvalue",
			"skillfinal if skill is 2": "shieldmod*skillvalue",
			"skillfinal if skill is 3": "bashmod*skillvalue",
			"skillfinal if skill is 4": "chargemod*skillvalue",
			"skillfinal if skill is 5": "spearsmod*skillvalue",
			"skillfinal if skill is 6": "lightbladesmod*skillvalue",
			"skillfinal if skill is 7": "heavybladesmod*skillvalue",
			"skillfinal if skill is 8": "bludgeoningmod*skillvalue",
			"skillfinal if skill is 9": "axesmod*skillvalue",
			"skillfinal if skill is 10": "ripostemod*skillvalue",
			"skillfinal if skill is 11": "closecombatmod*skillvalue",
			"skillfinal if skill is 12": "feintmod*skillvalue",
			"skillfinal if skill is 13": "dirtytricksmod*skillvalue",
			"skillfinal if skill is 14": "appraisemod*skillvalue"
		};
		let result = jsonSL(generator);
		//console.log(result);
		return {
			skillfinal: result.skillfinal, 
			skillmax: result.skillmax
		};
	}
	
	self.state.skillPoints = 10;
	let skills = {
		"tactics": 0,
		"dodge": 0,
		"parry": 0,
		"shield": 0,
		"bash": 0,
		"charge": 0,
		"spear": 0,
		"lightBlade": 0,
		"heavyBlade": 0,
		"bludgeoning": 0,
		"axe": 0,
		"riposte": 0,
		"closeCombat": 0,
		"feint": 0,
		"dirtyTrick": 0,
		"appraise": 0
	};
	
	let skillMaxes = {
		"tactics": 16,
		"dodge": 16,
		"parry": 16,
		"shield": 16,
		"bash": 16,
		"charge": 16,
		"spear": 16,
		"lightBlade": 16,
		"heavyBlade": 16,
		"bludgeoning": 16,
		"axe": 16,
		"riposte": 16,
		"closeCombat": 16,
		"feint": 16,
		"dirtyTrick": 16,
		"appraise": 16
	};
	self.share.skillMaxes = skillMaxes;
	let skillLabels = [
		"dodge",
		"parry",
		"shield",
		"bash",
		"charge",
		"spear",
		"lightBlade",
		"heavyBlade",
		"bludgeoning",
		"axe",
		"riposte",
		"closeCombat",
		"feint",
		"dirtyTrick",
		"appraise"
	];
	
	self.state.skills = waject();
	for (let label in skills) {
		$(`#skills .slider-container:has([name=${label}])`).
			siblings('.proficiency').text("0.00");
		setDescription(label, 0);
		
		let result = generateSkills(skillLabels.indexOf(label), skills[label]);
		skillMaxes[label] = result.skillmax;
		if (skillMaxes[label] === undefined) {
			skillMaxes[label] = 16;
		}
		$(`#skills .slider[name=${label}]`).
			children('.custom-handle').text(skills[label]);
	
		$(`#skills .slider-container:has([name=${label}])>.max`).
			text(self.state.skillCeiling + "/" + skillMaxes[label]);
	
		self.state.skills.mk({
			property: label,
			value: 0,
			preset: (o, name, val) => {
				
				if (o[name] === val) {
					return;
				}
				console.log('skill change:', name, val);
	
				let skillPoints = totalSkillPoints;
				for (let skill in o) {
					if (!(skill in skills) || skill === "toString") {
						continue;
					}
					if (skill === name) {
						skillPoints -= val;
					} else {
						skillPoints -= o[skill];
					}
				}
				if (skillPoints < 0) {
					return false;
				}
	
				self.state.skillPoints = skillPoints;
				
				if (name === "tactics") {
					o[name] = val;
					for (let skill in o) {
						if (skill === "tactics" || skill === "toString") {
							continue;
						}
						let r = generateSkills(skillLabels.indexOf(skill), o[skill]);
						$(`#skills .slider-container:has([name=${skill}])`).
							siblings('.proficiency').text(r.skillfinal.toFixed(2));
						setDescription(skill, r.skillfinal);
					}
					$(`#skills .slider-container:has([name=${name}])`).
						siblings('.proficiency').text(val.toFixed(2));
					setDescription(name, val);
				} else {
					let result = generateSkills(skillLabels.indexOf(name), val);
					$(`#skills .slider-container:has([name=${name}])`).
						siblings('.proficiency').text(result.skillfinal.toFixed(2));
					setDescription(name, result.skillfinal);
				}
				let skillChange = {};
				skillChange[name] = val;
				$(`#skills .slider[name=${name}`).slider('value', val).
					children('.custom-handle').text(val);
				socket.emit("gladiator-skill-change", skillChange);
			}
		});
	}
	
	socket.on("gladiator-skills", data => {
		console.log("skills:",data);
		totalSkillPoints = data.skillPoints;
		self.state.skillPoints = data.skillPoints;
		let t = 200;
		for (let label in skills) {
			if (label in data && skills[label] !== data[label]) {
				totalSkillPoints += data[label];
				setTimeout(() => {
					self.state.skills[label] = data[label];
				}, t);
			}
			t += 75;
		}
	
	});
	
	socket.emit("gladiator-skills-ready");
};
modules.skills.prototype.hook.comms.prototype = modules.skills.prototype;
