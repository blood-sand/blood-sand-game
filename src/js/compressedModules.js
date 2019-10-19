const __SHARE__ = {};
window.modules = {
        share: __SHARE__,
        fetch: function (name) {
            let m = new this[name];
            this[name].prototype.loaded = true;
            return m;
        }
    };
window.modules.eventLoop = function () {
        const self = this;
	
	if (!self.loaded) {
	    new self.control.events();
	    new self.control.mouseState();
	}
    };
    
    window.modules.eventLoop.prototype.parent = window;
    window.modules.eventLoop.prototype.state = {};
    window.modules.eventLoop.prototype.share = __SHARE__;
    window.modules.eventLoop.prototype.loaded = false;
    window.modules.eventLoop.prototype.control={};
window.modules.eventLoop.prototype.control.events=function() {
        const self = this;
	
	self.share.eventLoop = new (function eventLoop() {
	    let lastUpdate = Date.now();
	    const interval = 250;
	
	    const events = {};
	    const whenCheckers = [];
	    const afterCheckers = [];
	
	    this.on = function on(title, handle) {
	        if (events[title] === undefined) {
	            events[title] = [handle];
	        } else {
	            events[title].push(handle);
	        }
	    };
	
	    this.emit = function emit(title, data) {
	        if (events[title] === undefined) {
	            return;
	        }
	        events[title].forEach(handle => handle(data));
	    };
	
	    this.when = function (checker, handler) {
	        whenCheckers.push(() => {
	            if (checker()) {
	                handler();
	            }
	        });
	    };
	
	    this.after = function (checker, handler) {
	        afterCheckers.push(function action () {
	            if (checker()) {
	                afterCheckers.splice(
	                    afterCheckers.indexOf(action), 
	                    1
	                );
	                handler();
	            }
	        });
	    };
	
	    function tick () {
	        let now = Date.now();
	        if ((lastUpdate + interval) < now) {
	            lastUpdate = now;
	            whenCheckers.forEach(fn => fn());
	            afterCheckers.forEach(fn => fn());
	        }
	        return window.requestAnimationFrame(tick);
	    }
	    window.requestAnimationFrame(tick);
	});
    };
    window.modules.eventLoop.prototype.control.events.prototype = window.modules.eventLoop.prototype;
window.modules.eventLoop.prototype.control.mouseState=function() {
        const self = this;
	
	self.share.mouseIsDown = false;
	
	$(document).on('mousedown', () => {
	    self.share.mouseIsDown = true;
	});
	
	$(document).on('mouseup', () => {
	    self.share.mouseIsDown = false;
	});
    };
    window.modules.eventLoop.prototype.control.mouseState.prototype = window.modules.eventLoop.prototype;
window.modules.navigation = function () {
        const self = this;
	
	if (!self.loaded) {
	    $('head').append("<style>" + self.display.style + "</style>");
	    $('#game').append(self.display.view);
	    new self.control.events();
	    self.modules.fetch('settings');
	    self.modules.fetch('gladiator');
	    self.modules.fetch('listGladiators');
	}
    };
    window.modules.navigation.prototype.modules = {
        share: __SHARE__,
        fetch: function (name) {
            let m = new this[name];
            this[name].prototype.loaded = true;
            return m;
        }
    };
window.modules.navigation.prototype.modules.gladiator = function () {
        const self = this;
	
	if (!self.loaded) {
	    $('head').append("<style>" + self.display.style + "</style>");
	    $('#game').append(self.display.view);
	    new self.control.events();
	}
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules = {
        share: __SHARE__,
        fetch: function (name) {
            let m = new this[name];
            this[name].prototype.loaded = true;
            return m;
        }
    };
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes = function () {
        const self = this;
	
	if (!self.loaded) {
	    new self.hook.comms();
	    new self.control.events();
	}
	
    };
    
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.parent = window.modules.navigation.prototype.modules.gladiator.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.control.events=function() {
        const self = this;
	const eventLoop = self.share.eventLoop;
	const attributes = self.state.attributes;
	const modifiers = self.state.modifiers;
	let cultureSettings;
	
	function updateSliders() {
	    Object.keys(attributes).forEach(prop => {
	        if (prop === "serverSettings") {
	            return;
	        }
	        $(`#attributes [name=${prop}]`).
	            slider('value', attributes[prop]).
	            children('.custom-handle').
	            text(attributes[prop]);
	    });
	}
	
	eventLoop.after(() => (
	        !cultureSettings &&
	        (cultureSettings = self.share.cultureSettings)
	    ), () => {
	        cultureSettings.bindInput('name', 
	            $('#attributes [name=name]')
	        );
	});
	
	$( "#attributes .slider" ).slider({
	    create: function() {
	        $(this).children('.custom-handle').text( $(this).slider("value"));
	    },
	    slide: function( event, ui ) {
	        let name = $(this).attr('name');
	        if (ui.value > attributes[name]) {
	            let diff = ui.value - attributes[name];
	            if ((attributes.abilitySum + diff) > 91) {
	                return false;
	            }
	        }
	        
	        $(this).children('.custom-handle').text(ui.value);
	        
	    },
	    min: 3,
	    max: 18,
	    animate: 'slow'
	});
	$('#attributes [name=abilitySum]').
	    slider('option', 'max', 91).
	    slider('option', 'min', 21);
	
	$('#attributes .randomizeAttributes').on('click', e => {
	    let sum = attributes.abilitySum;
	    self.state.ignoreUpdate = true;
	    attributes.abilitySum = 21;
	    self.state.ignoreUpdate = false;
	    attributes.abilitySum = sum;
	    updateSliders();
	});
	
	$('#attributes ul>li .slider').each(function () {
	    let name = $(this).attr('name');
	
	    attributes.bindInput({
	        property: name,
	        element: $(this),
	        event: 'slidestop',
	        outHandler (element, value) {
	            element.
	                slider('value', value).
	                children('.custom-handle').
	                    text(value);
	        },
	        inHandler (element, proxy, prop) {
	            proxy[prop] = element.slider('value');
	            return updateSliders();
	        }
	    });
	});
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.control.modifiers=function() {
        const self = this;
	
	const modifiers = self.state.modifiers;
	$('#attributes ul>li .slider').each(function () {
	    let name = $(this).attr('name');
	    let fieldTooltip = "";
	    let slider = $(`#attributes [name=${name}`);
	    if (name in modifiers.final) {
	        slider.siblings('.final').text(modifiers.final[name]);
	    }
	
	    if (name in modifiers.age) {
	        if (modifiers.age[name] > 0) {
	            fieldTooltip += "+"
	        }
	        fieldTooltip += `${modifiers.age[name]} from age, `;
	    }
	
	    if (name in modifiers.bmi) {
	        if (modifiers.bmi[name] > 0) {
	            fieldTooltip += "+"
	        }
	        fieldTooltip += `${modifiers.bmi[name]} from BMI, `;
	    }
	
	    if (name in modifiers.sex) {
	        if (modifiers.sex[name] > 0) {
	            fieldTooltip += "+"
	        }
	        fieldTooltip += `${modifiers.sex[name]} from sex, `;
	    }
	
	    fieldTooltip = fieldTooltip.substr(0, fieldTooltip.length - 2);
	    if (fieldTooltip.length > 0) {
	        fieldTooltip += ".";
	    }
	    slider.parent('li').attr('title', fieldTooltip);
	});
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.control.modifiers.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.display.box=$("<div id=\"attributes\" class=\"item\"> <span> <img title=\"Don't have time for this? Generate random Attributes.\" src=\"/img/dice.png\" class=\"randomizeAttributes dice\"> Attributes For <input name=\"name\" value=\"Name Your Gladiator\"> </span> <ul class=\"gladiatorData\"> <li> <span class=\"label\">strength</span> <div class=\"slider\" name=\"strength\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">dexterity</span> <div class=\"slider\" name=\"dexterity\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">perception</span> <div class=\"slider\" name=\"perception\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">endurance</span> <div class=\"slider\" name=\"endurance\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">intelligence</span> <div class=\"slider\" name=\"intelligence\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">willpower</span> <div class=\"slider\" name=\"willpower\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">vitality</span> <div class=\"slider\" name=\"vitality\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span>ability sum</span> <div class=\"slider\" name=\"abilitySum\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> </li> </ul> </div>");
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.display.style="#attributes div < button[name=\"attributesNext\"] { display: block; } #attributes button[name=\"attributesPrevious\"] { display: block; float: left; } #attributes ul>li>.label { flex: 7; } #attributes ul>li>.final { flex: 2; } #attributes .slider { width: 480px; margin: 11.75px 40px; } #attributes input[name=\"name\"] { width: 57%; } #attributes button[name=\"attributesNext\"] { display: block; float: right; }";
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.hook={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.hook.comms=function() {
        const self = this;
	
	const MAX_ABILITY_SUM = 91;
	const MAX_STAT_SIZE = 18;
	const MIN_STAT_SIZE = 3;
	
	const attributes = waject({
	    strength: MIN_STAT_SIZE,
	    dexterity: MIN_STAT_SIZE,
	    perception: MIN_STAT_SIZE,
	    endurance: MIN_STAT_SIZE,
	    intelligence: MIN_STAT_SIZE,
	    willpower: MIN_STAT_SIZE,
	    vitality: MIN_STAT_SIZE,
	    abilitySum: MIN_STAT_SIZE * 7,
	    serverSettings: {}
	});
	
	const updatable = self.share.utility.isServerUpdatable;
	self.state.ignoreUpdate = false;
	
	function randomProperty (obj, f = () => true) {
	    var keys = Object.keys(obj).filter(f);
	    return  keys[keys.length * Math.random() << 0];
	};
	attributes.on('set', 'abilitySum', (result) => {
	    let target = result.target;
	    let val = result.value;
	    let prop = result.key;
	
	    if (isNaN(val)) {
	        result.value = target[prop];
	        result.cycle = false;
	        return;
	    }
	    let attrPool = {};
	    Object.keys(target).forEach(prop => {
	        if (prop === "abilitySum" || 
	            prop === "serverSettings") {
	            return;
	        }
	        attrPool[prop] = target[prop];
	    });
	    if (val > target.abilitySum) {
	        if (val > MAX_ABILITY_SUM) {
	            val = MAX_ABILITY_SUM;
	        }
	        let diff = val - target.abilitySum;
	        while (diff > 0) {
	            let randProp = randomProperty(attrPool);
	            if (target[randProp] >= MAX_STAT_SIZE) {
	                delete attrPool[randProp];
	                continue;
	            }
	            target[randProp] += 1;
	            diff -= 1;
	        }
	        result.value = val;
	        return;
	    }
	    if (val < target.abilitySum) {
	        if (val < (MIN_STAT_SIZE * 7)) {
	            val = MIN_STAT_SIZE * 7;
	        }
	        let diff = target.abilitySum - val;
	        while (diff > 0) {
	            let randProp = randomProperty(attrPool);
	            if (target[randProp] <= MIN_STAT_SIZE) {
	                delete attrPool[randProp];
	                continue;
	            }
	            target[randProp] -= 1;
	            diff -= 1;
	        }
	        result.value = val;
	        return;
	    }
	});
	
	attributes.on('set', (result) => {
	    let target = result.target;
	    let val = result.value;
	    let prop = result.key;
	    if (prop === "serverSettings") {
	        return;
	    }
	
	    if (prop === "abilitySum") {
	        return;
	    }
	
	    if (isNaN(val)) {
	        result.value = target[prop];
	        result.cycle = false;
	        return;
	    }
	
	    if (val > target[prop]) {
	        if (val > MAX_STAT_SIZE) {
	            val = MAX_STAT_SIZE;
	        }
	        let diff = val - target[prop];
	        if ((target.abilitySum + diff) > MAX_ABILITY_SUM) {
	            diff -= (target.abilitySum + diff) - MAX_ABILITY_SUM;
	        }
	        result.value = target[prop] + diff;
	        target.abilitySum += diff;
	        return;
	    }
	
	    if (val < target[prop]) {
	        if (val < MIN_STAT_SIZE) {
	            val = MIN_STAT_SIZE;
	        }
	        let diff = target[prop] - val;
	        result.value = target[prop] - diff;
	        target.abilitySum -= diff;
	        return;
	    }
	});
	
	self.state.attributes = attributes;
	self.share.attributeSettings = attributes;
	self.state.modifiers = {
	    age: {},
	    bmi: {},
	    sex: {},
	    final: {}
	};
	
	attributes.on('set', (result) => {
	    if (self.state.ignoreUpdate || 
	        !updatable(result)) {
	        return;
	    }
	    self.state.ignoreUpdate = true;
	    let update = {};
	    Object.keys(attributes).forEach(prop => {
	        if (prop === "serverSettings") {
	            return;
	        }
	        if (prop === result.key) {
	            update[prop] = result.value;
	            return;
	        }
	        update[prop] = attributes[prop];
	    });
	    attributes.serverSettings = update;
	    socket.emit("gladiator-attributes-change", update);
	    self.state.ignoreUpdate = false;
	});
	
	socket.on("gladiator-attributes", data => {
	    let serverSettings = {};
	    let same = true;
	    for (prop in data) {
	        if (prop === "abilitySum" ||
	            prop === "modifiers") {
	            continue;
	        }
	        serverSettings[prop] = data[prop];
	        if (data[prop] !== attributes[prop]) {
	            attributes[prop] = data[prop];
	            same = false;
	        }
	    }
	    if (!same) {
	        attributes.abilitySum = attributes.abilitySum;
	        serverSettings.abilitySum = attributes.abilitySum;
	        attributes.serverSettings = serverSettings;
	    }
	
	    self.state.modifiers.age = data.modifiers.age;
	    self.state.modifiers.bmi = data.modifiers.bmi;
	    self.state.modifiers.sex = data.modifiers.sex;
	    self.state.modifiers.final = data.modifiers.final;
	    new self.control.modifiers;
	});
	
	socket.emit("gladiator-attributes-ready");
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics = function () {
        const self = this;
	
	if (!self.loaded) {
	    new self.hook.comms();
	    new self.control.events();
	}
	
    };
    
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.parent = window.modules.navigation.prototype.modules.gladiator.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.control.events=function() {
        const self = this;
	const biometrics = self.state.biometrics;
	const eventLoop = self.share.eventLoop;
	let cultureSettings;
	$('#biometrics select').selectric();
	
	eventLoop.after(() => (
	        !cultureSettings &&
	        (cultureSettings = self.share.cultureSettings)
	    ), () => {
	        cultureSettings.bindInput('name', 
	            $('#biometrics [name=name]')
	        );
	        cultureSettings.bindInput({
	            property: 'culture',
	            element: $('#biometrics [name=culture]'),
	            outHandler: (element, val) => 
	                $(element).val(val).selectric()
	        });
	        cultureSettings.bindInput({
	            property: 'sex',
	            element: $('#biometrics [name=sex]'),
	            outHandler: (element, val) => 
	                $(element).val(val).selectric()
	        });
	});
	
	$('#biometrics ul>li input').each(function () {
	    biometrics.bindInput(this.name, this);
	});
	
	$('#biometrics').on(
	    'click', 
	    '.randomizeBiometrics', 
	    self.state.requestBiometrics
	);
	
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.display.box=$("<div id=\"biometrics\" class=\"item\"> <span> <img title=\"Don't Like These? Generate new Biometrics. This will not overwrite culture, sex, rank or name.\" src=\"/img/dice.png\" class=\"randomizeBiometrics dice\"> Biometrics For <input name=\"name\" value=\"Name Your Gladiator\"> </span> <ul class=\"gladiatorData\"> <li> <span>Culture</span> <select class=\"stat\" name=\"culture\"> <option>roman</option> <option>gallic</option> <option>germanic</option> <option>syrian</option> <option>numidian</option> <option>thracian</option> <option>greek</option> <option>iberian</option> <option>judean</option> <option>scythian</option> </select> </li> <li> <span>Sex</span> <select class=\"stat\" name=\"sex\"> <option>male</option> <option>female</option> </select> </li> <li> <span>Rank</span> <input type=\"number\" class=\"stat\" name=\"rank\" min=1 max=15> </li> <li> <span>Age</span> <input type=\"number\" class=\"stat\" name=\"age\" readonly> </li> <li> <span>Weight</span> <input type=\"number\" class=\"stat\" name=\"weight\" readonly> </li> <li> <span>Height</span> <input type=\"number\" class=\"stat\" name=\"height\" readonly> </li> <li> <span>BMI</span> <input type=\"number\" class=\"stat\" name=\"bmi\" readonly> </li> <li> <span>Reach</span> <input type=\"number\" class=\"stat\" name=\"reach\" readonly> </li> </ul> </div>");
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.display.style="div < button[name=\"biometricsNext\"] { display: block; } button[name=\"biometricsPrevious\"] { display: block; float: left; } #biometrics input[name=\"name\"] { width: 50%; } #biometrics select { width: 150px; } button[name=\"biometricsNext\"] { display: block; float: right; }";
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.hook={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.hook.comms=function() {
        const self = this;
	
	const biometrics = waject({
	    culture: 0,
	    sex: 0,
	    rank: 0,
	    age: 0,
	    weight: 0,
	    height: 0,
	    bmi: 0,
	    reach: 0
	});
	
	let serverRank;
	
	const biometricLabels = Object.keys(biometrics);
	biometricLabels.splice(biometricLabels.indexOf("serverSettings"), 1);
	
	self.share.biometricSettings = biometrics;
	self.state.biometrics = biometrics;
	
	self.state.requestBiometrics = function () {
	    console.log("requesting biometrics..");
	    socket.emit("gladiator-biometrics-generate");
	}
	
	biometrics.on('set', 'rank', (target, prop, val) => {
	    if (serverRank === undefined) {
	        return;
	    }
	    val = parseInt(val);
	    if (val < 1 || val > 15 || isNaN(val)) {
	        requestAnimationFrame(() => (biometrics.rank = serverRank));
	        return false;
	    }
	    target[prop] = val;
	    if (serverRank === val) {
	        return;
	    }
	    serverRank = val;
	    socket.emit('gladiator-biometrics-rank', val);
	});
	
	socket.on("gladiator-biometrics", data => {
	    biometrics['*'] = data;
	    serverRank = data.rank;
	});
	
	socket.emit("gladiator-biometrics-ready");
	
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats = function () {
        const self = this;
	
	if (!self.loaded) {
	    //new self.hook.comms();
	    //new self.control.events();
	} else {
	    //socket.emit("gladiator-combatStats-generate");
	}
    };
    
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.parent = window.modules.navigation.prototype.modules.gladiator.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.control.events=function() {
        const self = this;
	
	$('#combatStats [name=name]').val(self.share.name);
	
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.display.box=$("<div id=\"combatStats\" class=\"item\"> <span> Combat Statistics For <input name=\"name\" value=\"Name Your Gladiator\"> </span> <ul class=\"gladiatorData\"> <li title=\"Affected by endurance, lifestyle, rank, vitality, weight, and willpower.\"> <span>Health</span> <input type=\"number\" class=\"stat\" name=\"health\" readonly> </li> <li title=\"Affected by endurance, lifestyle, rank, vitality, willpower.\"> <span>Stamina</span> <input type=\"number\" class=\"stat\" name=\"stamina\" readonly> </li> <li> <span>Stamina Recovery</span> <input type=\"number\" class=\"stat\" name=\"staminaRecovery\" readonly> </li> <li> <span>Initiative</span> <input type=\"number\" class=\"stat\" name=\"initiative\" readonly> </li> <li> <span>Nerve</span> <input type=\"number\" class=\"stat\" name=\"nerve\" readonly> </li> <li> <span>Offense</span> <input type=\"number\" class=\"stat\" name=\"offense\" readonly> </li> <li> <span>Defense</span> <input type=\"number\" class=\"stat\" name=\"defense\" readonly> </li> <li> <span>Dodge</span> <input type=\"number\" class=\"stat\" name=\"dodge\" readonly> </li> <li> <span>Parry</span> <input type=\"number\" class=\"stat\" name=\"parry\" readonly> </li> </ul> </div>");
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.display.style="div < button[name=\"combatStatsNext\"] { display: block; } button[name=\"combatStatsPrevious\"] { display: block; float: left; } #combatStats input[name=\"name\"] { width: 50%; } #combatStats select { width: 150px; } button[name=\"combatStatsNext\"] { display: block; float: right; }";
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.hook={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.hook.comms=function() {
        const self = this;
	
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
	    combatStatsLabels.forEach(name => {
	        if (name in data) {
	            let val = data[name];
	            if (/\./.test("" + val)) {
	                val = val.toFixed(2);
	            }
	            $(`[name="${name}"]`).val(val);
	        }
	    });
	});
	
	socket.emit("gladiator-combatStats-ready");
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture = function () {
        const self = this;
	if (!self.loaded) {
	    new self.hook.comms();
	    new self.control.events();
	}
    };
    
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.parent = window.modules.navigation.prototype.modules.gladiator.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.control.events=function() {
        const self = this;
	
	const settings = self.state.settings;
	
	function getRandomInt(min, max) {
	    min = Math.ceil(min);
	    max = Math.floor(max);
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	function generateName () {
	    if (!settings.culture || !settings.sex) {
	        return;
	    }
	    let ref = self.state.names[settings.culture]
	    if (ref) {
	        ref = ref[settings.sex];
	    }
	    if (!ref) {
	        return;
	    }
	    let randName = ref[Math.floor(Math.random()*ref.length)];
	    settings.name = randName;
	};
	
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
	
	settings.bindInput('name', 
	    $('#culture [name=name]')
	);
	settings.bindInput({
	    property: 'culture',
	    element: $('#culture [name=culture]'),
	    outHandler: (element, val) => 
	        $(element).val(val).selectric()
	});
	settings.bindInput({
	    property: 'sex',
	    element: $('#culture [name=sex]'),
	    outHandler: (element, val) => 
	        $(element).val(val).selectric()
	});
	
	$('#culture select').selectric();
	
	$('#culture').on('click', '.randomizeName', e => {
	    generateName();
	});
	$('#culture').on('click', '.randomizeCulture', e => {
	    let randCulture = getRandomInt(0, 9);
	    let randSex = getRandomInt(0, 1);
	    settings.culture = cultures[randCulture];
	    settings.sex = sexes[randSex];
	    generateName();
	});
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.display.box=$("<div id=\"culture\" class=\"item\"> <span> <img title=\"Randomly Generate Culture, Sex and Name.\" src=\"/img/dice.png\" class=\"randomizeCulture dice\"> Culture of <input name=\"name\" placeholder=\"Name This Fighter\"> </span> <ul class=\"gladiatorData\"> <li> <span>Culture</span> <select class=\"stat\" name=\"culture\"> <option>roman</option> <option>gallic</option> <option>germanic</option> <option>syrian</option> <option>numidian</option> <option>thracian</option> <option>greek</option> <option>iberian</option> <option>judean</option> <option>scythian</option> </select> </li> <li> <span>Sex</span> <select class=\"stat\" name=\"sex\"> <option>male</option> <option>female</option> </select> </li> <li> <span> Name <img title=\"Randomly Generate a name based on The Fighter's Culture and Sex.\" src=\"/img/dice.png\" class=\"randomizeName dice\"> </span> <input class=\"stat\" name=\"name\"> </li> </ul> </div>");
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.display.style="div < button[name=\"cultureNext\"] { display: block; } #culture input[name=\"name\"] { width: 450px; } button[name=\"cultureNext\"] { display: block; float:right; } ";
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.hook={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.hook.comms=function() {
        const self = this;
	
	let updatable = self.share.utility.isServerUpdatable;
	
	self.state.settings = waject({
	    name: '',
	    culture: '',
	    sex: '',
	    serverSettings: {}
	});
	let settings = self.state.settings;
	self.share.cultureSettings = settings;
	
	self.state.names = {};
	
	function updateServer(result) {
	    let target = result.target;
	    target[result.key] = result.value;
	    for (setting in target.serverSettings) {
	        val = target.serverSettings[setting];
	        if (val !== target[setting]) {
	            target.serverSettings[setting] = target[setting];
	            socket.emit(`gladiator-${setting}`, target[setting]);
	        }
	    }
	}
	
	settings.on('set', (result) => {
	    if (!updatable(result)) {
	        return;
	    }
	    updateServer(result);
	});
	
	socket.emit("gladiator-culture-ready");
	
	socket.on("gladiator-names", d => {
	    self.state.names = d;
	});
	socket.on("gladiator-culture-info", d => {
	    self.state.cultureInfo = d;
	});
	socket.on("gladiator-name", d => {
	    settings.serverSettings.name = d;
	    settings.name = d;
	});
	socket.on("gladiator-sex", d => {
	    settings.serverSettings.sex = d;
	    settings.sex = d;
	});
	socket.on("gladiator-culture", d => {
	    settings.serverSettings.culture = d;
	    settings.culture = d;
	});
	
	
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills = function () {
        const self = this;
	
	if (!self.loaded) {
	    //new self.hook.comms();
	    //new self.control.events();
	} else {
	    //self.state.regenerateSkills();
	}
	
    };
    
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.parent = window.modules.navigation.prototype.modules.gladiator.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.control.events=function() {
        const self = this;
	
	socket.on('gladiator-rank', data => {
	    let rank = data;
	    let rankMax = rank * 2;
	    for (let label in self.share.skillMaxes) {
	        let skillMax = self.share.skillMaxes[label];
	        let max = (rankMax < skillMax) ? rankMax : skillMax;
	        $(`#skills .slider-container:has(.slider[name=${label}])`).
	                attr('title', `Maximum of ${max} for rank ${rank}`);
	    }
	});
	
	$( "#skills .slider" ).slider({
	    create: function() {
	        let name = $(this).attr('name');
	        let max = self.share.skillMaxes[name];
	        let rank = self.share.biometrics.rank || 1;
	        let rankMax = rank * 2;
	        $('#skills .slider-container').attr('title', `Maximum of ${rankMax} for rank ${rank}`);
	        $(this).slider('option', 'max', max);
	        $(this).children('.custom-handle').text( $(this).slider("value"));
	    },
	    slide: function( event, ui ) {
	        
	        let name = $(this).attr('name');
	        let max = $(this).slider('option', 'max');
	        let highestPoint = self.state.skillPoints + $(this).slider('value');
	        let rank = self.share.biometrics.rank || 1;
	        let rankMax = rank * 2;
	        let skillCeiling = rankMax;
	        if (skillCeiling < highestPoint) {
	            highestPoint = skillCeiling;
	        }
	        if (max < highestPoint) {
	            highestPoint = max;
	        }
	        
	        if (ui.value > highestPoint) {
	            ui.value = highestPoint;
	        }
	        $(this).children('.custom-handle').text(ui.value);
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
	        if (ui.value !== self.state.skills[name]) {
	            $(this).slider('option', 'value', self.state.skills[name]);
	        }
	    },
	    min: 0,
	    max: 16,
	    animate: 'slow'
	});
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.display.box=$("<div id=\"skills\" class=\"item\"> <span> Skills For <input name=\"name\" value=\"Name Your Gladiator\"> </span> <div> <span>Skill Points:</span> <span name=\"skillPoints\">10</span> </div> <ul class=\"gladiatorData\"> <li> <span>tactics</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"tactics\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\">n</span> <span class=\"description\">Abyssmal</span> </li> <li> <span>dodge</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"dodge\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>parry</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"parry\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>shield</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"shield\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>bash</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"bash\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>charge</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"charge\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>spear</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"spear\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>light Blade</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"lightBlade\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>heavy Blade</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"heavyBlade\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>bludgeoning</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"bludgeoning\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>axe</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"axe\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>riposte</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"riposte\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>close Combat</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"closeCombat\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>feint</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"feint\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>dirty Trick</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"dirtyTrick\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>appraise</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"appraise\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> </ul> </div>");
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.display.style="#skills div < button[name=\"skillsNext\"] { display: block; } #skills button[name=\"skillsPrevious\"] { display: block; float: left; } #skills .slider { width: 200px; margin: 11.75px 40px; } #skills input[name=\"name\"] { width: 57%; } #skills button[name=\"skillsNext\"] { display: block; float: right; color: rgba(255,255,255,0.72); } #skills .proficiency { text-align: center; } #skills .slider-container { color: rgba(170, 130, 25, 0.5); background: rgba(0, 0, 0, 0.32); border: 1px solid rgba(0,0,0,0.72); padding-left: 5px; padding-right: 5px; display: flex; flex-direction: row; width: 350px; } #skills .min { text-align: right; } #skills .max { text-align: left; } #skills .max, #skills .min { flex-grow: 0; padding-top: 8px; } #skills ul.gladiatorData>li>span:nth-child(1) { flex-grow: 3; }";
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.hook={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.hook.comms=function() {
        const self = this;
	let skillCeiling = 16;
	let totalSkillPoints = 0;
	
	function calcTactics (val) {
	    let input = {
	        intelligence: self.share.attributes.intelligence,
	        rank: self.share.biometrics.rank,
	        tacticspoints: val
	    };
	    let generator = {
	        input: input,
	        value: "0.1*(input.intelligence+input.rank/10*20)/2*input.tacticspoints"
	    };
	
	    return jsonSL(generator)
	}
	
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
	    value: self.share.biometrics.rank * 2,
	});
	
	self.state.regenerateSkills = function () {
	    for (let label in skills) {
	        let val = self.state.skills[label];
	        if (label === "tactics") {
	            $(`#skills .slider-container:has([name=${label}])`).
	                siblings('.proficiency').text(calcTactics(val).toFixed(2));
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
	    let input;
	    let attr = self.share.attributes;
	    let biometrics = self.share.biometrics;
	    if (!attr || !biometrics) {
	        input = {
	            "skill": skill,
	            "skillpointsspent": val,
	            "skillvalue": 0,
	            "dexterity": 10,
	            "endurance": 10,
	            "perception": 10,
	            "strength": 10,
	            "vitality": 10,
	            "willpower": 10,
	            "intelligence": 10,
	            "rank": 1,
	            "tacticspoints": 0
	        };
	    } else {
	        input = {
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
	        };
	    }
	    let generator = {
	        "input": input,
	
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
	    "tactics": 10,
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
	    if (label === "tactics") {
	        skillMaxes.tactics = 10;
	    }
	    if (skillMaxes[label] === undefined) {
	        skillMaxes[label] = 16;
	    }
	    //console.log("skillmax:", label, skillMaxes[label], result.skillmax);
	    $(`#skills .slider[name=${label}]`).
	        children('.custom-handle').text(skills[label]);
	
	    $(`#skills .slider-container:has([name=${label}])>.max`).
	        text(skillMaxes[label]);
	
	    self.state.skills.mk({
	        property: label,
	        value: 0,
	        preset: (o, name, val) => {
	            
	            if (o[name] === val) {
	                //console.log("ignoring update:", name, o[name], val);
	                return;
	            }
	            //console.log('skill change:', name, o[name], val);
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
	            //console.log('skill points:', skillPoints);
	            if (skillPoints < 0 && val > o[name]) {
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
	                let tacticsVal = calcTactics(val);
	                //console.log('tac val:', tacticsVal);
	                $(`#skills .slider-container:has([name=${name}])`).
	                    siblings('.proficiency').text(tacticsVal.toFixed(2));
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
	    //console.log("skills:",data);
	    totalSkillPoints = data.skillPoints;
	    self.state.skillPoints = data.skillPoints;
	    let t = 120;
	    for (let label in skills) {
	        if (label in data) {
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
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype;

    window.modules.navigation.prototype.modules.gladiator.prototype.parent = window.modules.navigation.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.control.events=function() {
        const self = this;
	
	let activeTab = 0;
	const baseTitle = "Blood & Sand";
	const baseContent = document.getElementsByTagName('html')[0].outerHTML;
	let stateLoad = false;
	
	function setWindowTitle (url) {
	    url = url.replace('/', '');
	    let parts = url.split('-');
	    let title = baseTitle + " |";
	    parts.forEach((part, i) => {
	        let newPart = "";
	        for (let i = 0; i < part.length; i += 1) {
	            if (i === 0) {
	                newPart = " " + part[i].toUpperCase();
	            } else if (part[i] === part[i].toUpperCase()) {
	                newPart += " " + part[i];
	            } else {
	                newPart += part[i]
	            }
	        }
	        title += newPart;
	    });
	    document.title = title;
	}
	
	$('#gladiator ul>li:has(a[href])').each(function (i) {
	    let id = $(this).children('a').attr('href').replace('#', '');
	    if (!(id in self.modules)) {
	        return;
	    }
	    $('head').append('<style>' + self.modules[id].prototype.display.style + '</style>');
	    $('#gladiator').append(self.modules[id].prototype.display.box);
	    self.modules.fetch(id);
	    if (window.location.pathname === ('/gladiator-' + id)) {
	        setWindowTitle('gladiator-' + id);
	        activeTab = i;
	    }
	});
	
	if (activeTab === 0) {
	    setWindowTitle('gladiator-culture');
	    window.history.replaceState({
	        id: '#culture'
	    }, baseTitle + " | gladiator culture", "gladiator-culture" + location.search + location.hash);
	}
	self.modules.fetch('culture');
	
	$('#gladiator').tabs({
	    active: activeTab,
	    beforeActivate (event, ui) {
	        let newUrl = ui.newTab.children('a').attr('href').replace("#", "gladiator-");
	        let content = baseContent;
	        setWindowTitle(newUrl);
	        if (!stateLoad) {
	            window.history.pushState({
	                id: ui.newTab.children('a').attr('href')
	            }, "", newUrl + location.search + location.hash);
	        }
	    },
	    activate (event, ui) {
	        stateLoad = false;
	        let id = ui.newPanel.attr('id').replace('#', '');
	        if (id in self.modules) {
	            self.modules.fetch(id);
	        }
	    }
	});
	
	window.onpopstate = function (e) {
	    if (e.state && e.state.id) {
	        stateLoad = true;
	        $('#gladiator').tabs()
	        $(`a[href="${e.state.id}"]`).trigger('click');
	    }
	};
	
	let path = window.location.pathname;
	
	self.share.eventLoop.when(() => (
	        window.location.pathname !== path &&
	        window.location.pathname.substring(1,10) === "gladiator"
	    ), () => {
	    path = window.location.pathname;
	    let id = path.replace('/gladiator-', '');
	    if (!$(`#${id}`).is(':visible')) {
	        $(`#gladiator a[href="#${id}"]`).trigger('click');
	    }
	});
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.display.style="#gladiator.ui-tabs { font-size: 15.3px; }";
window.modules.navigation.prototype.modules.gladiator.prototype.display.view=$("<div id=\"gladiator\"> <ul> <li title=\"Tell Me About This Prospect.\"><a href=\"#culture\"> <i class=\"fas fa-flag\"></i> Culture </a></li> <li title=\"Here's What We Know About This Fighter.\"><a href=\"#biometrics\"> <i class=\"fas fa-diagnoses\"></i> Biometrics </a></li> <li title=\"Tell Me This Gladiator's Strengths.\"><a href=\"#attributes\"> <i class=\"fas fa-star-half-alt\"></i> Attributes </a></li> <li title=\"Spend Points; Get Good.\"><a href=\"#skills\"> <i class=\"fas fa-chess\"></i> Skills </a></li> <li title=\"We Hope You'll be Pleased With This Gladiator's Competitive Analysis.\"><a href=\"#combatStats\"> <i class=\"fas fa-fist-raised\"></i> Combat Stats </a></li> <li title=\"(Not Yet Implemented) &nbsp; &nbsp; &nbsp; &nbsp; Get Ready.\"><a href=\"#saveGladiator\"> <i class=\"fas fa-save\"></i> Save </a></li> </ul> <div id=\"saveGladiator\" class=\"item\" title=\"Nuu! ... R.I.P. Save\"> CAN HAZ SAVE!?!? </div> </div> ");
window.modules.navigation.prototype.modules.listGladiators = function () {
        const self = this;
	
	if (!self.loaded) {
	}
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules = {
        share: __SHARE__,
        fetch: function (name) {
            let m = new this[name];
            this[name].prototype.loaded = true;
            return m;
        }
    };
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes = function () {
        const self = this;
	
	if (!self.loaded) {
	    new self.hook.comms();
	    new self.control.events();
	}
	
    };
    
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.parent = window.modules.navigation.prototype.modules.gladiator.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.control.events=function() {
        const self = this;
	const eventLoop = self.share.eventLoop;
	const attributes = self.state.attributes;
	const modifiers = self.state.modifiers;
	let cultureSettings;
	
	function updateSliders() {
	    Object.keys(attributes).forEach(prop => {
	        if (prop === "serverSettings") {
	            return;
	        }
	        $(`#attributes [name=${prop}]`).
	            slider('value', attributes[prop]).
	            children('.custom-handle').
	            text(attributes[prop]);
	    });
	}
	
	eventLoop.after(() => (
	        !cultureSettings &&
	        (cultureSettings = self.share.cultureSettings)
	    ), () => {
	        cultureSettings.bindInput('name', 
	            $('#attributes [name=name]')
	        );
	});
	
	$( "#attributes .slider" ).slider({
	    create: function() {
	        $(this).children('.custom-handle').text( $(this).slider("value"));
	    },
	    slide: function( event, ui ) {
	        let name = $(this).attr('name');
	        if (ui.value > attributes[name]) {
	            let diff = ui.value - attributes[name];
	            if ((attributes.abilitySum + diff) > 91) {
	                return false;
	            }
	        }
	        
	        $(this).children('.custom-handle').text(ui.value);
	        
	    },
	    min: 3,
	    max: 18,
	    animate: 'slow'
	});
	$('#attributes [name=abilitySum]').
	    slider('option', 'max', 91).
	    slider('option', 'min', 21);
	
	$('#attributes .randomizeAttributes').on('click', e => {
	    let sum = attributes.abilitySum;
	    self.state.ignoreUpdate = true;
	    attributes.abilitySum = 21;
	    self.state.ignoreUpdate = false;
	    attributes.abilitySum = sum;
	    updateSliders();
	});
	
	$('#attributes ul>li .slider').each(function () {
	    let name = $(this).attr('name');
	
	    attributes.bindInput({
	        property: name,
	        element: $(this),
	        event: 'slidestop',
	        outHandler (element, value) {
	            element.
	                slider('value', value).
	                children('.custom-handle').
	                    text(value);
	        },
	        inHandler (element, proxy, prop) {
	            proxy[prop] = element.slider('value');
	            return updateSliders();
	        }
	    });
	});
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.control.modifiers=function() {
        const self = this;
	
	const modifiers = self.state.modifiers;
	$('#attributes ul>li .slider').each(function () {
	    let name = $(this).attr('name');
	    let fieldTooltip = "";
	    let slider = $(`#attributes [name=${name}`);
	    if (name in modifiers.final) {
	        slider.siblings('.final').text(modifiers.final[name]);
	    }
	
	    if (name in modifiers.age) {
	        if (modifiers.age[name] > 0) {
	            fieldTooltip += "+"
	        }
	        fieldTooltip += `${modifiers.age[name]} from age, `;
	    }
	
	    if (name in modifiers.bmi) {
	        if (modifiers.bmi[name] > 0) {
	            fieldTooltip += "+"
	        }
	        fieldTooltip += `${modifiers.bmi[name]} from BMI, `;
	    }
	
	    if (name in modifiers.sex) {
	        if (modifiers.sex[name] > 0) {
	            fieldTooltip += "+"
	        }
	        fieldTooltip += `${modifiers.sex[name]} from sex, `;
	    }
	
	    fieldTooltip = fieldTooltip.substr(0, fieldTooltip.length - 2);
	    if (fieldTooltip.length > 0) {
	        fieldTooltip += ".";
	    }
	    slider.parent('li').attr('title', fieldTooltip);
	});
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.control.modifiers.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.display.box=$("<div id=\"attributes\" class=\"item\"> <span> <img title=\"Don't have time for this? Generate random Attributes.\" src=\"/img/dice.png\" class=\"randomizeAttributes dice\"> Attributes For <input name=\"name\" value=\"Name Your Gladiator\"> </span> <ul class=\"gladiatorData\"> <li> <span class=\"label\">strength</span> <div class=\"slider\" name=\"strength\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">dexterity</span> <div class=\"slider\" name=\"dexterity\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">perception</span> <div class=\"slider\" name=\"perception\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">endurance</span> <div class=\"slider\" name=\"endurance\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">intelligence</span> <div class=\"slider\" name=\"intelligence\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">willpower</span> <div class=\"slider\" name=\"willpower\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">vitality</span> <div class=\"slider\" name=\"vitality\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span>ability sum</span> <div class=\"slider\" name=\"abilitySum\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> </li> </ul> </div>");
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.display.style="#attributes div < button[name=\"attributesNext\"] { display: block; } #attributes button[name=\"attributesPrevious\"] { display: block; float: left; } #attributes ul>li>.label { flex: 7; } #attributes ul>li>.final { flex: 2; } #attributes .slider { width: 480px; margin: 11.75px 40px; } #attributes input[name=\"name\"] { width: 57%; } #attributes button[name=\"attributesNext\"] { display: block; float: right; }";
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.hook={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.hook.comms=function() {
        const self = this;
	
	const MAX_ABILITY_SUM = 91;
	const MAX_STAT_SIZE = 18;
	const MIN_STAT_SIZE = 3;
	
	const attributes = waject({
	    strength: MIN_STAT_SIZE,
	    dexterity: MIN_STAT_SIZE,
	    perception: MIN_STAT_SIZE,
	    endurance: MIN_STAT_SIZE,
	    intelligence: MIN_STAT_SIZE,
	    willpower: MIN_STAT_SIZE,
	    vitality: MIN_STAT_SIZE,
	    abilitySum: MIN_STAT_SIZE * 7,
	    serverSettings: {}
	});
	
	const updatable = self.share.utility.isServerUpdatable;
	self.state.ignoreUpdate = false;
	
	function randomProperty (obj, f = () => true) {
	    var keys = Object.keys(obj).filter(f);
	    return  keys[keys.length * Math.random() << 0];
	};
	attributes.on('set', 'abilitySum', (result) => {
	    let target = result.target;
	    let val = result.value;
	    let prop = result.key;
	
	    if (isNaN(val)) {
	        result.value = target[prop];
	        result.cycle = false;
	        return;
	    }
	    let attrPool = {};
	    Object.keys(target).forEach(prop => {
	        if (prop === "abilitySum" || 
	            prop === "serverSettings") {
	            return;
	        }
	        attrPool[prop] = target[prop];
	    });
	    if (val > target.abilitySum) {
	        if (val > MAX_ABILITY_SUM) {
	            val = MAX_ABILITY_SUM;
	        }
	        let diff = val - target.abilitySum;
	        while (diff > 0) {
	            let randProp = randomProperty(attrPool);
	            if (target[randProp] >= MAX_STAT_SIZE) {
	                delete attrPool[randProp];
	                continue;
	            }
	            target[randProp] += 1;
	            diff -= 1;
	        }
	        result.value = val;
	        return;
	    }
	    if (val < target.abilitySum) {
	        if (val < (MIN_STAT_SIZE * 7)) {
	            val = MIN_STAT_SIZE * 7;
	        }
	        let diff = target.abilitySum - val;
	        while (diff > 0) {
	            let randProp = randomProperty(attrPool);
	            if (target[randProp] <= MIN_STAT_SIZE) {
	                delete attrPool[randProp];
	                continue;
	            }
	            target[randProp] -= 1;
	            diff -= 1;
	        }
	        result.value = val;
	        return;
	    }
	});
	
	attributes.on('set', (result) => {
	    let target = result.target;
	    let val = result.value;
	    let prop = result.key;
	    if (prop === "serverSettings") {
	        return;
	    }
	
	    if (prop === "abilitySum") {
	        return;
	    }
	
	    if (isNaN(val)) {
	        result.value = target[prop];
	        result.cycle = false;
	        return;
	    }
	
	    if (val > target[prop]) {
	        if (val > MAX_STAT_SIZE) {
	            val = MAX_STAT_SIZE;
	        }
	        let diff = val - target[prop];
	        if ((target.abilitySum + diff) > MAX_ABILITY_SUM) {
	            diff -= (target.abilitySum + diff) - MAX_ABILITY_SUM;
	        }
	        result.value = target[prop] + diff;
	        target.abilitySum += diff;
	        return;
	    }
	
	    if (val < target[prop]) {
	        if (val < MIN_STAT_SIZE) {
	            val = MIN_STAT_SIZE;
	        }
	        let diff = target[prop] - val;
	        result.value = target[prop] - diff;
	        target.abilitySum -= diff;
	        return;
	    }
	});
	
	self.state.attributes = attributes;
	self.share.attributeSettings = attributes;
	self.state.modifiers = {
	    age: {},
	    bmi: {},
	    sex: {},
	    final: {}
	};
	
	attributes.on('set', (result) => {
	    if (self.state.ignoreUpdate || 
	        !updatable(result)) {
	        return;
	    }
	    self.state.ignoreUpdate = true;
	    let update = {};
	    Object.keys(attributes).forEach(prop => {
	        if (prop === "serverSettings") {
	            return;
	        }
	        if (prop === result.key) {
	            update[prop] = result.value;
	            return;
	        }
	        update[prop] = attributes[prop];
	    });
	    attributes.serverSettings = update;
	    socket.emit("gladiator-attributes-change", update);
	    self.state.ignoreUpdate = false;
	});
	
	socket.on("gladiator-attributes", data => {
	    let serverSettings = {};
	    let same = true;
	    for (prop in data) {
	        if (prop === "abilitySum" ||
	            prop === "modifiers") {
	            continue;
	        }
	        serverSettings[prop] = data[prop];
	        if (data[prop] !== attributes[prop]) {
	            attributes[prop] = data[prop];
	            same = false;
	        }
	    }
	    if (!same) {
	        attributes.abilitySum = attributes.abilitySum;
	        serverSettings.abilitySum = attributes.abilitySum;
	        attributes.serverSettings = serverSettings;
	    }
	
	    self.state.modifiers.age = data.modifiers.age;
	    self.state.modifiers.bmi = data.modifiers.bmi;
	    self.state.modifiers.sex = data.modifiers.sex;
	    self.state.modifiers.final = data.modifiers.final;
	    new self.control.modifiers;
	});
	
	socket.emit("gladiator-attributes-ready");
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics = function () {
        const self = this;
	
	if (!self.loaded) {
	    new self.hook.comms();
	    new self.control.events();
	}
	
    };
    
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.parent = window.modules.navigation.prototype.modules.gladiator.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.control.events=function() {
        const self = this;
	const biometrics = self.state.biometrics;
	const eventLoop = self.share.eventLoop;
	let cultureSettings;
	$('#biometrics select').selectric();
	
	eventLoop.after(() => (
	        !cultureSettings &&
	        (cultureSettings = self.share.cultureSettings)
	    ), () => {
	        cultureSettings.bindInput('name', 
	            $('#biometrics [name=name]')
	        );
	        cultureSettings.bindInput({
	            property: 'culture',
	            element: $('#biometrics [name=culture]'),
	            outHandler: (element, val) => 
	                $(element).val(val).selectric()
	        });
	        cultureSettings.bindInput({
	            property: 'sex',
	            element: $('#biometrics [name=sex]'),
	            outHandler: (element, val) => 
	                $(element).val(val).selectric()
	        });
	});
	
	$('#biometrics ul>li input').each(function () {
	    biometrics.bindInput(this.name, this);
	});
	
	$('#biometrics').on(
	    'click', 
	    '.randomizeBiometrics', 
	    self.state.requestBiometrics
	);
	
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.display.box=$("<div id=\"biometrics\" class=\"item\"> <span> <img title=\"Don't Like These? Generate new Biometrics. This will not overwrite culture, sex, rank or name.\" src=\"/img/dice.png\" class=\"randomizeBiometrics dice\"> Biometrics For <input name=\"name\" value=\"Name Your Gladiator\"> </span> <ul class=\"gladiatorData\"> <li> <span>Culture</span> <select class=\"stat\" name=\"culture\"> <option>roman</option> <option>gallic</option> <option>germanic</option> <option>syrian</option> <option>numidian</option> <option>thracian</option> <option>greek</option> <option>iberian</option> <option>judean</option> <option>scythian</option> </select> </li> <li> <span>Sex</span> <select class=\"stat\" name=\"sex\"> <option>male</option> <option>female</option> </select> </li> <li> <span>Rank</span> <input type=\"number\" class=\"stat\" name=\"rank\" min=1 max=15> </li> <li> <span>Age</span> <input type=\"number\" class=\"stat\" name=\"age\" readonly> </li> <li> <span>Weight</span> <input type=\"number\" class=\"stat\" name=\"weight\" readonly> </li> <li> <span>Height</span> <input type=\"number\" class=\"stat\" name=\"height\" readonly> </li> <li> <span>BMI</span> <input type=\"number\" class=\"stat\" name=\"bmi\" readonly> </li> <li> <span>Reach</span> <input type=\"number\" class=\"stat\" name=\"reach\" readonly> </li> </ul> </div>");
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.display.style="div < button[name=\"biometricsNext\"] { display: block; } button[name=\"biometricsPrevious\"] { display: block; float: left; } #biometrics input[name=\"name\"] { width: 50%; } #biometrics select { width: 150px; } button[name=\"biometricsNext\"] { display: block; float: right; }";
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.hook={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.hook.comms=function() {
        const self = this;
	
	const biometrics = waject({
	    culture: 0,
	    sex: 0,
	    rank: 0,
	    age: 0,
	    weight: 0,
	    height: 0,
	    bmi: 0,
	    reach: 0
	});
	
	let serverRank;
	
	const biometricLabels = Object.keys(biometrics);
	biometricLabels.splice(biometricLabels.indexOf("serverSettings"), 1);
	
	self.share.biometricSettings = biometrics;
	self.state.biometrics = biometrics;
	
	self.state.requestBiometrics = function () {
	    console.log("requesting biometrics..");
	    socket.emit("gladiator-biometrics-generate");
	}
	
	biometrics.on('set', 'rank', (target, prop, val) => {
	    if (serverRank === undefined) {
	        return;
	    }
	    val = parseInt(val);
	    if (val < 1 || val > 15 || isNaN(val)) {
	        requestAnimationFrame(() => (biometrics.rank = serverRank));
	        return false;
	    }
	    target[prop] = val;
	    if (serverRank === val) {
	        return;
	    }
	    serverRank = val;
	    socket.emit('gladiator-biometrics-rank', val);
	});
	
	socket.on("gladiator-biometrics", data => {
	    biometrics['*'] = data;
	    serverRank = data.rank;
	});
	
	socket.emit("gladiator-biometrics-ready");
	
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats = function () {
        const self = this;
	
	if (!self.loaded) {
	    //new self.hook.comms();
	    //new self.control.events();
	} else {
	    //socket.emit("gladiator-combatStats-generate");
	}
    };
    
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.parent = window.modules.navigation.prototype.modules.gladiator.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.control.events=function() {
        const self = this;
	
	$('#combatStats [name=name]').val(self.share.name);
	
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.display.box=$("<div id=\"combatStats\" class=\"item\"> <span> Combat Statistics For <input name=\"name\" value=\"Name Your Gladiator\"> </span> <ul class=\"gladiatorData\"> <li title=\"Affected by endurance, lifestyle, rank, vitality, weight, and willpower.\"> <span>Health</span> <input type=\"number\" class=\"stat\" name=\"health\" readonly> </li> <li title=\"Affected by endurance, lifestyle, rank, vitality, willpower.\"> <span>Stamina</span> <input type=\"number\" class=\"stat\" name=\"stamina\" readonly> </li> <li> <span>Stamina Recovery</span> <input type=\"number\" class=\"stat\" name=\"staminaRecovery\" readonly> </li> <li> <span>Initiative</span> <input type=\"number\" class=\"stat\" name=\"initiative\" readonly> </li> <li> <span>Nerve</span> <input type=\"number\" class=\"stat\" name=\"nerve\" readonly> </li> <li> <span>Offense</span> <input type=\"number\" class=\"stat\" name=\"offense\" readonly> </li> <li> <span>Defense</span> <input type=\"number\" class=\"stat\" name=\"defense\" readonly> </li> <li> <span>Dodge</span> <input type=\"number\" class=\"stat\" name=\"dodge\" readonly> </li> <li> <span>Parry</span> <input type=\"number\" class=\"stat\" name=\"parry\" readonly> </li> </ul> </div>");
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.display.style="div < button[name=\"combatStatsNext\"] { display: block; } button[name=\"combatStatsPrevious\"] { display: block; float: left; } #combatStats input[name=\"name\"] { width: 50%; } #combatStats select { width: 150px; } button[name=\"combatStatsNext\"] { display: block; float: right; }";
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.hook={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.hook.comms=function() {
        const self = this;
	
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
	    combatStatsLabels.forEach(name => {
	        if (name in data) {
	            let val = data[name];
	            if (/\./.test("" + val)) {
	                val = val.toFixed(2);
	            }
	            $(`[name="${name}"]`).val(val);
	        }
	    });
	});
	
	socket.emit("gladiator-combatStats-ready");
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture = function () {
        const self = this;
	if (!self.loaded) {
	    new self.hook.comms();
	    new self.control.events();
	}
    };
    
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.parent = window.modules.navigation.prototype.modules.gladiator.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.control.events=function() {
        const self = this;
	
	const settings = self.state.settings;
	
	function getRandomInt(min, max) {
	    min = Math.ceil(min);
	    max = Math.floor(max);
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	function generateName () {
	    if (!settings.culture || !settings.sex) {
	        return;
	    }
	    let ref = self.state.names[settings.culture]
	    if (ref) {
	        ref = ref[settings.sex];
	    }
	    if (!ref) {
	        return;
	    }
	    let randName = ref[Math.floor(Math.random()*ref.length)];
	    settings.name = randName;
	};
	
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
	
	settings.bindInput('name', 
	    $('#culture [name=name]')
	);
	settings.bindInput({
	    property: 'culture',
	    element: $('#culture [name=culture]'),
	    outHandler: (element, val) => 
	        $(element).val(val).selectric()
	});
	settings.bindInput({
	    property: 'sex',
	    element: $('#culture [name=sex]'),
	    outHandler: (element, val) => 
	        $(element).val(val).selectric()
	});
	
	$('#culture select').selectric();
	
	$('#culture').on('click', '.randomizeName', e => {
	    generateName();
	});
	$('#culture').on('click', '.randomizeCulture', e => {
	    let randCulture = getRandomInt(0, 9);
	    let randSex = getRandomInt(0, 1);
	    settings.culture = cultures[randCulture];
	    settings.sex = sexes[randSex];
	    generateName();
	});
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.display.box=$("<div id=\"culture\" class=\"item\"> <span> <img title=\"Randomly Generate Culture, Sex and Name.\" src=\"/img/dice.png\" class=\"randomizeCulture dice\"> Culture of <input name=\"name\" placeholder=\"Name This Fighter\"> </span> <ul class=\"gladiatorData\"> <li> <span>Culture</span> <select class=\"stat\" name=\"culture\"> <option>roman</option> <option>gallic</option> <option>germanic</option> <option>syrian</option> <option>numidian</option> <option>thracian</option> <option>greek</option> <option>iberian</option> <option>judean</option> <option>scythian</option> </select> </li> <li> <span>Sex</span> <select class=\"stat\" name=\"sex\"> <option>male</option> <option>female</option> </select> </li> <li> <span> Name <img title=\"Randomly Generate a name based on The Fighter's Culture and Sex.\" src=\"/img/dice.png\" class=\"randomizeName dice\"> </span> <input class=\"stat\" name=\"name\"> </li> </ul> </div>");
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.display.style="div < button[name=\"cultureNext\"] { display: block; } #culture input[name=\"name\"] { width: 450px; } button[name=\"cultureNext\"] { display: block; float:right; } ";
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.hook={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.hook.comms=function() {
        const self = this;
	
	let updatable = self.share.utility.isServerUpdatable;
	
	self.state.settings = waject({
	    name: '',
	    culture: '',
	    sex: '',
	    serverSettings: {}
	});
	let settings = self.state.settings;
	self.share.cultureSettings = settings;
	
	self.state.names = {};
	
	function updateServer(result) {
	    let target = result.target;
	    target[result.key] = result.value;
	    for (setting in target.serverSettings) {
	        val = target.serverSettings[setting];
	        if (val !== target[setting]) {
	            target.serverSettings[setting] = target[setting];
	            socket.emit(`gladiator-${setting}`, target[setting]);
	        }
	    }
	}
	
	settings.on('set', (result) => {
	    if (!updatable(result)) {
	        return;
	    }
	    updateServer(result);
	});
	
	socket.emit("gladiator-culture-ready");
	
	socket.on("gladiator-names", d => {
	    self.state.names = d;
	});
	socket.on("gladiator-culture-info", d => {
	    self.state.cultureInfo = d;
	});
	socket.on("gladiator-name", d => {
	    settings.serverSettings.name = d;
	    settings.name = d;
	});
	socket.on("gladiator-sex", d => {
	    settings.serverSettings.sex = d;
	    settings.sex = d;
	});
	socket.on("gladiator-culture", d => {
	    settings.serverSettings.culture = d;
	    settings.culture = d;
	});
	
	
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills = function () {
        const self = this;
	
	if (!self.loaded) {
	    //new self.hook.comms();
	    //new self.control.events();
	} else {
	    //self.state.regenerateSkills();
	}
	
    };
    
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.parent = window.modules.navigation.prototype.modules.gladiator.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.control.events=function() {
        const self = this;
	
	socket.on('gladiator-rank', data => {
	    let rank = data;
	    let rankMax = rank * 2;
	    for (let label in self.share.skillMaxes) {
	        let skillMax = self.share.skillMaxes[label];
	        let max = (rankMax < skillMax) ? rankMax : skillMax;
	        $(`#skills .slider-container:has(.slider[name=${label}])`).
	                attr('title', `Maximum of ${max} for rank ${rank}`);
	    }
	});
	
	$( "#skills .slider" ).slider({
	    create: function() {
	        let name = $(this).attr('name');
	        let max = self.share.skillMaxes[name];
	        let rank = self.share.biometrics.rank || 1;
	        let rankMax = rank * 2;
	        $('#skills .slider-container').attr('title', `Maximum of ${rankMax} for rank ${rank}`);
	        $(this).slider('option', 'max', max);
	        $(this).children('.custom-handle').text( $(this).slider("value"));
	    },
	    slide: function( event, ui ) {
	        
	        let name = $(this).attr('name');
	        let max = $(this).slider('option', 'max');
	        let highestPoint = self.state.skillPoints + $(this).slider('value');
	        let rank = self.share.biometrics.rank || 1;
	        let rankMax = rank * 2;
	        let skillCeiling = rankMax;
	        if (skillCeiling < highestPoint) {
	            highestPoint = skillCeiling;
	        }
	        if (max < highestPoint) {
	            highestPoint = max;
	        }
	        
	        if (ui.value > highestPoint) {
	            ui.value = highestPoint;
	        }
	        $(this).children('.custom-handle').text(ui.value);
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
	        if (ui.value !== self.state.skills[name]) {
	            $(this).slider('option', 'value', self.state.skills[name]);
	        }
	    },
	    min: 0,
	    max: 16,
	    animate: 'slow'
	});
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.display.box=$("<div id=\"skills\" class=\"item\"> <span> Skills For <input name=\"name\" value=\"Name Your Gladiator\"> </span> <div> <span>Skill Points:</span> <span name=\"skillPoints\">10</span> </div> <ul class=\"gladiatorData\"> <li> <span>tactics</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"tactics\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\">n</span> <span class=\"description\">Abyssmal</span> </li> <li> <span>dodge</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"dodge\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>parry</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"parry\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>shield</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"shield\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>bash</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"bash\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>charge</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"charge\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>spear</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"spear\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>light Blade</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"lightBlade\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>heavy Blade</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"heavyBlade\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>bludgeoning</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"bludgeoning\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>axe</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"axe\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>riposte</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"riposte\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>close Combat</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"closeCombat\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>feint</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"feint\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>dirty Trick</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"dirtyTrick\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>appraise</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"appraise\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> </ul> </div>");
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.display.style="#skills div < button[name=\"skillsNext\"] { display: block; } #skills button[name=\"skillsPrevious\"] { display: block; float: left; } #skills .slider { width: 200px; margin: 11.75px 40px; } #skills input[name=\"name\"] { width: 57%; } #skills button[name=\"skillsNext\"] { display: block; float: right; color: rgba(255,255,255,0.72); } #skills .proficiency { text-align: center; } #skills .slider-container { color: rgba(170, 130, 25, 0.5); background: rgba(0, 0, 0, 0.32); border: 1px solid rgba(0,0,0,0.72); padding-left: 5px; padding-right: 5px; display: flex; flex-direction: row; width: 350px; } #skills .min { text-align: right; } #skills .max { text-align: left; } #skills .max, #skills .min { flex-grow: 0; padding-top: 8px; } #skills ul.gladiatorData>li>span:nth-child(1) { flex-grow: 3; }";
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.hook={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.hook.comms=function() {
        const self = this;
	let skillCeiling = 16;
	let totalSkillPoints = 0;
	
	function calcTactics (val) {
	    let input = {
	        intelligence: self.share.attributes.intelligence,
	        rank: self.share.biometrics.rank,
	        tacticspoints: val
	    };
	    let generator = {
	        input: input,
	        value: "0.1*(input.intelligence+input.rank/10*20)/2*input.tacticspoints"
	    };
	
	    return jsonSL(generator)
	}
	
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
	    value: self.share.biometrics.rank * 2,
	});
	
	self.state.regenerateSkills = function () {
	    for (let label in skills) {
	        let val = self.state.skills[label];
	        if (label === "tactics") {
	            $(`#skills .slider-container:has([name=${label}])`).
	                siblings('.proficiency').text(calcTactics(val).toFixed(2));
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
	    let input;
	    let attr = self.share.attributes;
	    let biometrics = self.share.biometrics;
	    if (!attr || !biometrics) {
	        input = {
	            "skill": skill,
	            "skillpointsspent": val,
	            "skillvalue": 0,
	            "dexterity": 10,
	            "endurance": 10,
	            "perception": 10,
	            "strength": 10,
	            "vitality": 10,
	            "willpower": 10,
	            "intelligence": 10,
	            "rank": 1,
	            "tacticspoints": 0
	        };
	    } else {
	        input = {
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
	        };
	    }
	    let generator = {
	        "input": input,
	
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
	    "tactics": 10,
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
	    if (label === "tactics") {
	        skillMaxes.tactics = 10;
	    }
	    if (skillMaxes[label] === undefined) {
	        skillMaxes[label] = 16;
	    }
	    //console.log("skillmax:", label, skillMaxes[label], result.skillmax);
	    $(`#skills .slider[name=${label}]`).
	        children('.custom-handle').text(skills[label]);
	
	    $(`#skills .slider-container:has([name=${label}])>.max`).
	        text(skillMaxes[label]);
	
	    self.state.skills.mk({
	        property: label,
	        value: 0,
	        preset: (o, name, val) => {
	            
	            if (o[name] === val) {
	                //console.log("ignoring update:", name, o[name], val);
	                return;
	            }
	            //console.log('skill change:', name, o[name], val);
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
	            //console.log('skill points:', skillPoints);
	            if (skillPoints < 0 && val > o[name]) {
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
	                let tacticsVal = calcTactics(val);
	                //console.log('tac val:', tacticsVal);
	                $(`#skills .slider-container:has([name=${name}])`).
	                    siblings('.proficiency').text(tacticsVal.toFixed(2));
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
	    //console.log("skills:",data);
	    totalSkillPoints = data.skillPoints;
	    self.state.skillPoints = data.skillPoints;
	    let t = 120;
	    for (let label in skills) {
	        if (label in data) {
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
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype;

    window.modules.navigation.prototype.modules.listGladiators.prototype.parent = window.modules.navigation.prototype;
    window.modules.navigation.prototype.modules.listGladiators.prototype.state = {};
    window.modules.navigation.prototype.modules.listGladiators.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.listGladiators.prototype.loaded = false;
    window.modules.navigation.prototype.modules.listGladiators.prototype.display={};
window.modules.navigation.prototype.modules.listGladiators.prototype.display.view=$("");
window.modules.navigation.prototype.modules.listGladiators.prototype.hook={};
window.modules.navigation.prototype.modules.listGladiators.prototype.hook.comms=function() {
        
    };
    window.modules.navigation.prototype.modules.listGladiators.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.listGladiators.prototype;
window.modules.navigation.prototype.modules.settings = function () {
        const self = this;
	
	if (!self.loaded) {
	    $('head').append("<style>" + self.display.style + "</style>");
	    $('#game').append(self.display.view);
	    self.state.dialog = $('#user-settings-dialog');
	    new self.hook.comms();
	    new self.control.sliders();
	    new self.control.dialog();
	    new self.control.sounds();
	}
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules = {
        share: __SHARE__,
        fetch: function (name) {
            let m = new this[name];
            this[name].prototype.loaded = true;
            return m;
        }
    };
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes = function () {
        const self = this;
	
	if (!self.loaded) {
	    new self.hook.comms();
	    new self.control.events();
	}
	
    };
    
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.parent = window.modules.navigation.prototype.modules.gladiator.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.control.events=function() {
        const self = this;
	const eventLoop = self.share.eventLoop;
	const attributes = self.state.attributes;
	const modifiers = self.state.modifiers;
	let cultureSettings;
	
	function updateSliders() {
	    Object.keys(attributes).forEach(prop => {
	        if (prop === "serverSettings") {
	            return;
	        }
	        $(`#attributes [name=${prop}]`).
	            slider('value', attributes[prop]).
	            children('.custom-handle').
	            text(attributes[prop]);
	    });
	}
	
	eventLoop.after(() => (
	        !cultureSettings &&
	        (cultureSettings = self.share.cultureSettings)
	    ), () => {
	        cultureSettings.bindInput('name', 
	            $('#attributes [name=name]')
	        );
	});
	
	$( "#attributes .slider" ).slider({
	    create: function() {
	        $(this).children('.custom-handle').text( $(this).slider("value"));
	    },
	    slide: function( event, ui ) {
	        let name = $(this).attr('name');
	        if (ui.value > attributes[name]) {
	            let diff = ui.value - attributes[name];
	            if ((attributes.abilitySum + diff) > 91) {
	                return false;
	            }
	        }
	        
	        $(this).children('.custom-handle').text(ui.value);
	        
	    },
	    min: 3,
	    max: 18,
	    animate: 'slow'
	});
	$('#attributes [name=abilitySum]').
	    slider('option', 'max', 91).
	    slider('option', 'min', 21);
	
	$('#attributes .randomizeAttributes').on('click', e => {
	    let sum = attributes.abilitySum;
	    self.state.ignoreUpdate = true;
	    attributes.abilitySum = 21;
	    self.state.ignoreUpdate = false;
	    attributes.abilitySum = sum;
	    updateSliders();
	});
	
	$('#attributes ul>li .slider').each(function () {
	    let name = $(this).attr('name');
	
	    attributes.bindInput({
	        property: name,
	        element: $(this),
	        event: 'slidestop',
	        outHandler (element, value) {
	            element.
	                slider('value', value).
	                children('.custom-handle').
	                    text(value);
	        },
	        inHandler (element, proxy, prop) {
	            proxy[prop] = element.slider('value');
	            return updateSliders();
	        }
	    });
	});
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.control.modifiers=function() {
        const self = this;
	
	const modifiers = self.state.modifiers;
	$('#attributes ul>li .slider').each(function () {
	    let name = $(this).attr('name');
	    let fieldTooltip = "";
	    let slider = $(`#attributes [name=${name}`);
	    if (name in modifiers.final) {
	        slider.siblings('.final').text(modifiers.final[name]);
	    }
	
	    if (name in modifiers.age) {
	        if (modifiers.age[name] > 0) {
	            fieldTooltip += "+"
	        }
	        fieldTooltip += `${modifiers.age[name]} from age, `;
	    }
	
	    if (name in modifiers.bmi) {
	        if (modifiers.bmi[name] > 0) {
	            fieldTooltip += "+"
	        }
	        fieldTooltip += `${modifiers.bmi[name]} from BMI, `;
	    }
	
	    if (name in modifiers.sex) {
	        if (modifiers.sex[name] > 0) {
	            fieldTooltip += "+"
	        }
	        fieldTooltip += `${modifiers.sex[name]} from sex, `;
	    }
	
	    fieldTooltip = fieldTooltip.substr(0, fieldTooltip.length - 2);
	    if (fieldTooltip.length > 0) {
	        fieldTooltip += ".";
	    }
	    slider.parent('li').attr('title', fieldTooltip);
	});
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.control.modifiers.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.display.box=$("<div id=\"attributes\" class=\"item\"> <span> <img title=\"Don't have time for this? Generate random Attributes.\" src=\"/img/dice.png\" class=\"randomizeAttributes dice\"> Attributes For <input name=\"name\" value=\"Name Your Gladiator\"> </span> <ul class=\"gladiatorData\"> <li> <span class=\"label\">strength</span> <div class=\"slider\" name=\"strength\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">dexterity</span> <div class=\"slider\" name=\"dexterity\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">perception</span> <div class=\"slider\" name=\"perception\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">endurance</span> <div class=\"slider\" name=\"endurance\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">intelligence</span> <div class=\"slider\" name=\"intelligence\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">willpower</span> <div class=\"slider\" name=\"willpower\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">vitality</span> <div class=\"slider\" name=\"vitality\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span>ability sum</span> <div class=\"slider\" name=\"abilitySum\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> </li> </ul> </div>");
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.display.style="#attributes div < button[name=\"attributesNext\"] { display: block; } #attributes button[name=\"attributesPrevious\"] { display: block; float: left; } #attributes ul>li>.label { flex: 7; } #attributes ul>li>.final { flex: 2; } #attributes .slider { width: 480px; margin: 11.75px 40px; } #attributes input[name=\"name\"] { width: 57%; } #attributes button[name=\"attributesNext\"] { display: block; float: right; }";
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.hook={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.hook.comms=function() {
        const self = this;
	
	const MAX_ABILITY_SUM = 91;
	const MAX_STAT_SIZE = 18;
	const MIN_STAT_SIZE = 3;
	
	const attributes = waject({
	    strength: MIN_STAT_SIZE,
	    dexterity: MIN_STAT_SIZE,
	    perception: MIN_STAT_SIZE,
	    endurance: MIN_STAT_SIZE,
	    intelligence: MIN_STAT_SIZE,
	    willpower: MIN_STAT_SIZE,
	    vitality: MIN_STAT_SIZE,
	    abilitySum: MIN_STAT_SIZE * 7,
	    serverSettings: {}
	});
	
	const updatable = self.share.utility.isServerUpdatable;
	self.state.ignoreUpdate = false;
	
	function randomProperty (obj, f = () => true) {
	    var keys = Object.keys(obj).filter(f);
	    return  keys[keys.length * Math.random() << 0];
	};
	attributes.on('set', 'abilitySum', (result) => {
	    let target = result.target;
	    let val = result.value;
	    let prop = result.key;
	
	    if (isNaN(val)) {
	        result.value = target[prop];
	        result.cycle = false;
	        return;
	    }
	    let attrPool = {};
	    Object.keys(target).forEach(prop => {
	        if (prop === "abilitySum" || 
	            prop === "serverSettings") {
	            return;
	        }
	        attrPool[prop] = target[prop];
	    });
	    if (val > target.abilitySum) {
	        if (val > MAX_ABILITY_SUM) {
	            val = MAX_ABILITY_SUM;
	        }
	        let diff = val - target.abilitySum;
	        while (diff > 0) {
	            let randProp = randomProperty(attrPool);
	            if (target[randProp] >= MAX_STAT_SIZE) {
	                delete attrPool[randProp];
	                continue;
	            }
	            target[randProp] += 1;
	            diff -= 1;
	        }
	        result.value = val;
	        return;
	    }
	    if (val < target.abilitySum) {
	        if (val < (MIN_STAT_SIZE * 7)) {
	            val = MIN_STAT_SIZE * 7;
	        }
	        let diff = target.abilitySum - val;
	        while (diff > 0) {
	            let randProp = randomProperty(attrPool);
	            if (target[randProp] <= MIN_STAT_SIZE) {
	                delete attrPool[randProp];
	                continue;
	            }
	            target[randProp] -= 1;
	            diff -= 1;
	        }
	        result.value = val;
	        return;
	    }
	});
	
	attributes.on('set', (result) => {
	    let target = result.target;
	    let val = result.value;
	    let prop = result.key;
	    if (prop === "serverSettings") {
	        return;
	    }
	
	    if (prop === "abilitySum") {
	        return;
	    }
	
	    if (isNaN(val)) {
	        result.value = target[prop];
	        result.cycle = false;
	        return;
	    }
	
	    if (val > target[prop]) {
	        if (val > MAX_STAT_SIZE) {
	            val = MAX_STAT_SIZE;
	        }
	        let diff = val - target[prop];
	        if ((target.abilitySum + diff) > MAX_ABILITY_SUM) {
	            diff -= (target.abilitySum + diff) - MAX_ABILITY_SUM;
	        }
	        result.value = target[prop] + diff;
	        target.abilitySum += diff;
	        return;
	    }
	
	    if (val < target[prop]) {
	        if (val < MIN_STAT_SIZE) {
	            val = MIN_STAT_SIZE;
	        }
	        let diff = target[prop] - val;
	        result.value = target[prop] - diff;
	        target.abilitySum -= diff;
	        return;
	    }
	});
	
	self.state.attributes = attributes;
	self.share.attributeSettings = attributes;
	self.state.modifiers = {
	    age: {},
	    bmi: {},
	    sex: {},
	    final: {}
	};
	
	attributes.on('set', (result) => {
	    if (self.state.ignoreUpdate || 
	        !updatable(result)) {
	        return;
	    }
	    self.state.ignoreUpdate = true;
	    let update = {};
	    Object.keys(attributes).forEach(prop => {
	        if (prop === "serverSettings") {
	            return;
	        }
	        if (prop === result.key) {
	            update[prop] = result.value;
	            return;
	        }
	        update[prop] = attributes[prop];
	    });
	    attributes.serverSettings = update;
	    socket.emit("gladiator-attributes-change", update);
	    self.state.ignoreUpdate = false;
	});
	
	socket.on("gladiator-attributes", data => {
	    let serverSettings = {};
	    let same = true;
	    for (prop in data) {
	        if (prop === "abilitySum" ||
	            prop === "modifiers") {
	            continue;
	        }
	        serverSettings[prop] = data[prop];
	        if (data[prop] !== attributes[prop]) {
	            attributes[prop] = data[prop];
	            same = false;
	        }
	    }
	    if (!same) {
	        attributes.abilitySum = attributes.abilitySum;
	        serverSettings.abilitySum = attributes.abilitySum;
	        attributes.serverSettings = serverSettings;
	    }
	
	    self.state.modifiers.age = data.modifiers.age;
	    self.state.modifiers.bmi = data.modifiers.bmi;
	    self.state.modifiers.sex = data.modifiers.sex;
	    self.state.modifiers.final = data.modifiers.final;
	    new self.control.modifiers;
	});
	
	socket.emit("gladiator-attributes-ready");
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics = function () {
        const self = this;
	
	if (!self.loaded) {
	    new self.hook.comms();
	    new self.control.events();
	}
	
    };
    
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.parent = window.modules.navigation.prototype.modules.gladiator.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.control.events=function() {
        const self = this;
	const biometrics = self.state.biometrics;
	const eventLoop = self.share.eventLoop;
	let cultureSettings;
	$('#biometrics select').selectric();
	
	eventLoop.after(() => (
	        !cultureSettings &&
	        (cultureSettings = self.share.cultureSettings)
	    ), () => {
	        cultureSettings.bindInput('name', 
	            $('#biometrics [name=name]')
	        );
	        cultureSettings.bindInput({
	            property: 'culture',
	            element: $('#biometrics [name=culture]'),
	            outHandler: (element, val) => 
	                $(element).val(val).selectric()
	        });
	        cultureSettings.bindInput({
	            property: 'sex',
	            element: $('#biometrics [name=sex]'),
	            outHandler: (element, val) => 
	                $(element).val(val).selectric()
	        });
	});
	
	$('#biometrics ul>li input').each(function () {
	    biometrics.bindInput(this.name, this);
	});
	
	$('#biometrics').on(
	    'click', 
	    '.randomizeBiometrics', 
	    self.state.requestBiometrics
	);
	
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.display.box=$("<div id=\"biometrics\" class=\"item\"> <span> <img title=\"Don't Like These? Generate new Biometrics. This will not overwrite culture, sex, rank or name.\" src=\"/img/dice.png\" class=\"randomizeBiometrics dice\"> Biometrics For <input name=\"name\" value=\"Name Your Gladiator\"> </span> <ul class=\"gladiatorData\"> <li> <span>Culture</span> <select class=\"stat\" name=\"culture\"> <option>roman</option> <option>gallic</option> <option>germanic</option> <option>syrian</option> <option>numidian</option> <option>thracian</option> <option>greek</option> <option>iberian</option> <option>judean</option> <option>scythian</option> </select> </li> <li> <span>Sex</span> <select class=\"stat\" name=\"sex\"> <option>male</option> <option>female</option> </select> </li> <li> <span>Rank</span> <input type=\"number\" class=\"stat\" name=\"rank\" min=1 max=15> </li> <li> <span>Age</span> <input type=\"number\" class=\"stat\" name=\"age\" readonly> </li> <li> <span>Weight</span> <input type=\"number\" class=\"stat\" name=\"weight\" readonly> </li> <li> <span>Height</span> <input type=\"number\" class=\"stat\" name=\"height\" readonly> </li> <li> <span>BMI</span> <input type=\"number\" class=\"stat\" name=\"bmi\" readonly> </li> <li> <span>Reach</span> <input type=\"number\" class=\"stat\" name=\"reach\" readonly> </li> </ul> </div>");
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.display.style="div < button[name=\"biometricsNext\"] { display: block; } button[name=\"biometricsPrevious\"] { display: block; float: left; } #biometrics input[name=\"name\"] { width: 50%; } #biometrics select { width: 150px; } button[name=\"biometricsNext\"] { display: block; float: right; }";
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.hook={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.hook.comms=function() {
        const self = this;
	
	const biometrics = waject({
	    culture: 0,
	    sex: 0,
	    rank: 0,
	    age: 0,
	    weight: 0,
	    height: 0,
	    bmi: 0,
	    reach: 0
	});
	
	let serverRank;
	
	const biometricLabels = Object.keys(biometrics);
	biometricLabels.splice(biometricLabels.indexOf("serverSettings"), 1);
	
	self.share.biometricSettings = biometrics;
	self.state.biometrics = biometrics;
	
	self.state.requestBiometrics = function () {
	    console.log("requesting biometrics..");
	    socket.emit("gladiator-biometrics-generate");
	}
	
	biometrics.on('set', 'rank', (target, prop, val) => {
	    if (serverRank === undefined) {
	        return;
	    }
	    val = parseInt(val);
	    if (val < 1 || val > 15 || isNaN(val)) {
	        requestAnimationFrame(() => (biometrics.rank = serverRank));
	        return false;
	    }
	    target[prop] = val;
	    if (serverRank === val) {
	        return;
	    }
	    serverRank = val;
	    socket.emit('gladiator-biometrics-rank', val);
	});
	
	socket.on("gladiator-biometrics", data => {
	    biometrics['*'] = data;
	    serverRank = data.rank;
	});
	
	socket.emit("gladiator-biometrics-ready");
	
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats = function () {
        const self = this;
	
	if (!self.loaded) {
	    //new self.hook.comms();
	    //new self.control.events();
	} else {
	    //socket.emit("gladiator-combatStats-generate");
	}
    };
    
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.parent = window.modules.navigation.prototype.modules.gladiator.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.control.events=function() {
        const self = this;
	
	$('#combatStats [name=name]').val(self.share.name);
	
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.display.box=$("<div id=\"combatStats\" class=\"item\"> <span> Combat Statistics For <input name=\"name\" value=\"Name Your Gladiator\"> </span> <ul class=\"gladiatorData\"> <li title=\"Affected by endurance, lifestyle, rank, vitality, weight, and willpower.\"> <span>Health</span> <input type=\"number\" class=\"stat\" name=\"health\" readonly> </li> <li title=\"Affected by endurance, lifestyle, rank, vitality, willpower.\"> <span>Stamina</span> <input type=\"number\" class=\"stat\" name=\"stamina\" readonly> </li> <li> <span>Stamina Recovery</span> <input type=\"number\" class=\"stat\" name=\"staminaRecovery\" readonly> </li> <li> <span>Initiative</span> <input type=\"number\" class=\"stat\" name=\"initiative\" readonly> </li> <li> <span>Nerve</span> <input type=\"number\" class=\"stat\" name=\"nerve\" readonly> </li> <li> <span>Offense</span> <input type=\"number\" class=\"stat\" name=\"offense\" readonly> </li> <li> <span>Defense</span> <input type=\"number\" class=\"stat\" name=\"defense\" readonly> </li> <li> <span>Dodge</span> <input type=\"number\" class=\"stat\" name=\"dodge\" readonly> </li> <li> <span>Parry</span> <input type=\"number\" class=\"stat\" name=\"parry\" readonly> </li> </ul> </div>");
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.display.style="div < button[name=\"combatStatsNext\"] { display: block; } button[name=\"combatStatsPrevious\"] { display: block; float: left; } #combatStats input[name=\"name\"] { width: 50%; } #combatStats select { width: 150px; } button[name=\"combatStatsNext\"] { display: block; float: right; }";
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.hook={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.hook.comms=function() {
        const self = this;
	
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
	    combatStatsLabels.forEach(name => {
	        if (name in data) {
	            let val = data[name];
	            if (/\./.test("" + val)) {
	                val = val.toFixed(2);
	            }
	            $(`[name="${name}"]`).val(val);
	        }
	    });
	});
	
	socket.emit("gladiator-combatStats-ready");
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture = function () {
        const self = this;
	if (!self.loaded) {
	    new self.hook.comms();
	    new self.control.events();
	}
    };
    
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.parent = window.modules.navigation.prototype.modules.gladiator.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.control.events=function() {
        const self = this;
	
	const settings = self.state.settings;
	
	function getRandomInt(min, max) {
	    min = Math.ceil(min);
	    max = Math.floor(max);
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	function generateName () {
	    if (!settings.culture || !settings.sex) {
	        return;
	    }
	    let ref = self.state.names[settings.culture]
	    if (ref) {
	        ref = ref[settings.sex];
	    }
	    if (!ref) {
	        return;
	    }
	    let randName = ref[Math.floor(Math.random()*ref.length)];
	    settings.name = randName;
	};
	
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
	
	settings.bindInput('name', 
	    $('#culture [name=name]')
	);
	settings.bindInput({
	    property: 'culture',
	    element: $('#culture [name=culture]'),
	    outHandler: (element, val) => 
	        $(element).val(val).selectric()
	});
	settings.bindInput({
	    property: 'sex',
	    element: $('#culture [name=sex]'),
	    outHandler: (element, val) => 
	        $(element).val(val).selectric()
	});
	
	$('#culture select').selectric();
	
	$('#culture').on('click', '.randomizeName', e => {
	    generateName();
	});
	$('#culture').on('click', '.randomizeCulture', e => {
	    let randCulture = getRandomInt(0, 9);
	    let randSex = getRandomInt(0, 1);
	    settings.culture = cultures[randCulture];
	    settings.sex = sexes[randSex];
	    generateName();
	});
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.display.box=$("<div id=\"culture\" class=\"item\"> <span> <img title=\"Randomly Generate Culture, Sex and Name.\" src=\"/img/dice.png\" class=\"randomizeCulture dice\"> Culture of <input name=\"name\" placeholder=\"Name This Fighter\"> </span> <ul class=\"gladiatorData\"> <li> <span>Culture</span> <select class=\"stat\" name=\"culture\"> <option>roman</option> <option>gallic</option> <option>germanic</option> <option>syrian</option> <option>numidian</option> <option>thracian</option> <option>greek</option> <option>iberian</option> <option>judean</option> <option>scythian</option> </select> </li> <li> <span>Sex</span> <select class=\"stat\" name=\"sex\"> <option>male</option> <option>female</option> </select> </li> <li> <span> Name <img title=\"Randomly Generate a name based on The Fighter's Culture and Sex.\" src=\"/img/dice.png\" class=\"randomizeName dice\"> </span> <input class=\"stat\" name=\"name\"> </li> </ul> </div>");
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.display.style="div < button[name=\"cultureNext\"] { display: block; } #culture input[name=\"name\"] { width: 450px; } button[name=\"cultureNext\"] { display: block; float:right; } ";
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.hook={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.hook.comms=function() {
        const self = this;
	
	let updatable = self.share.utility.isServerUpdatable;
	
	self.state.settings = waject({
	    name: '',
	    culture: '',
	    sex: '',
	    serverSettings: {}
	});
	let settings = self.state.settings;
	self.share.cultureSettings = settings;
	
	self.state.names = {};
	
	function updateServer(result) {
	    let target = result.target;
	    target[result.key] = result.value;
	    for (setting in target.serverSettings) {
	        val = target.serverSettings[setting];
	        if (val !== target[setting]) {
	            target.serverSettings[setting] = target[setting];
	            socket.emit(`gladiator-${setting}`, target[setting]);
	        }
	    }
	}
	
	settings.on('set', (result) => {
	    if (!updatable(result)) {
	        return;
	    }
	    updateServer(result);
	});
	
	socket.emit("gladiator-culture-ready");
	
	socket.on("gladiator-names", d => {
	    self.state.names = d;
	});
	socket.on("gladiator-culture-info", d => {
	    self.state.cultureInfo = d;
	});
	socket.on("gladiator-name", d => {
	    settings.serverSettings.name = d;
	    settings.name = d;
	});
	socket.on("gladiator-sex", d => {
	    settings.serverSettings.sex = d;
	    settings.sex = d;
	});
	socket.on("gladiator-culture", d => {
	    settings.serverSettings.culture = d;
	    settings.culture = d;
	});
	
	
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills = function () {
        const self = this;
	
	if (!self.loaded) {
	    //new self.hook.comms();
	    //new self.control.events();
	} else {
	    //self.state.regenerateSkills();
	}
	
    };
    
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.parent = window.modules.navigation.prototype.modules.gladiator.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.control.events=function() {
        const self = this;
	
	socket.on('gladiator-rank', data => {
	    let rank = data;
	    let rankMax = rank * 2;
	    for (let label in self.share.skillMaxes) {
	        let skillMax = self.share.skillMaxes[label];
	        let max = (rankMax < skillMax) ? rankMax : skillMax;
	        $(`#skills .slider-container:has(.slider[name=${label}])`).
	                attr('title', `Maximum of ${max} for rank ${rank}`);
	    }
	});
	
	$( "#skills .slider" ).slider({
	    create: function() {
	        let name = $(this).attr('name');
	        let max = self.share.skillMaxes[name];
	        let rank = self.share.biometrics.rank || 1;
	        let rankMax = rank * 2;
	        $('#skills .slider-container').attr('title', `Maximum of ${rankMax} for rank ${rank}`);
	        $(this).slider('option', 'max', max);
	        $(this).children('.custom-handle').text( $(this).slider("value"));
	    },
	    slide: function( event, ui ) {
	        
	        let name = $(this).attr('name');
	        let max = $(this).slider('option', 'max');
	        let highestPoint = self.state.skillPoints + $(this).slider('value');
	        let rank = self.share.biometrics.rank || 1;
	        let rankMax = rank * 2;
	        let skillCeiling = rankMax;
	        if (skillCeiling < highestPoint) {
	            highestPoint = skillCeiling;
	        }
	        if (max < highestPoint) {
	            highestPoint = max;
	        }
	        
	        if (ui.value > highestPoint) {
	            ui.value = highestPoint;
	        }
	        $(this).children('.custom-handle').text(ui.value);
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
	        if (ui.value !== self.state.skills[name]) {
	            $(this).slider('option', 'value', self.state.skills[name]);
	        }
	    },
	    min: 0,
	    max: 16,
	    animate: 'slow'
	});
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.display.box=$("<div id=\"skills\" class=\"item\"> <span> Skills For <input name=\"name\" value=\"Name Your Gladiator\"> </span> <div> <span>Skill Points:</span> <span name=\"skillPoints\">10</span> </div> <ul class=\"gladiatorData\"> <li> <span>tactics</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"tactics\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\">n</span> <span class=\"description\">Abyssmal</span> </li> <li> <span>dodge</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"dodge\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>parry</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"parry\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>shield</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"shield\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>bash</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"bash\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>charge</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"charge\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>spear</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"spear\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>light Blade</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"lightBlade\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>heavy Blade</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"heavyBlade\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>bludgeoning</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"bludgeoning\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>axe</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"axe\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>riposte</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"riposte\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>close Combat</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"closeCombat\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>feint</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"feint\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>dirty Trick</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"dirtyTrick\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>appraise</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"appraise\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> </ul> </div>");
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.display.style="#skills div < button[name=\"skillsNext\"] { display: block; } #skills button[name=\"skillsPrevious\"] { display: block; float: left; } #skills .slider { width: 200px; margin: 11.75px 40px; } #skills input[name=\"name\"] { width: 57%; } #skills button[name=\"skillsNext\"] { display: block; float: right; color: rgba(255,255,255,0.72); } #skills .proficiency { text-align: center; } #skills .slider-container { color: rgba(170, 130, 25, 0.5); background: rgba(0, 0, 0, 0.32); border: 1px solid rgba(0,0,0,0.72); padding-left: 5px; padding-right: 5px; display: flex; flex-direction: row; width: 350px; } #skills .min { text-align: right; } #skills .max { text-align: left; } #skills .max, #skills .min { flex-grow: 0; padding-top: 8px; } #skills ul.gladiatorData>li>span:nth-child(1) { flex-grow: 3; }";
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.hook={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.hook.comms=function() {
        const self = this;
	let skillCeiling = 16;
	let totalSkillPoints = 0;
	
	function calcTactics (val) {
	    let input = {
	        intelligence: self.share.attributes.intelligence,
	        rank: self.share.biometrics.rank,
	        tacticspoints: val
	    };
	    let generator = {
	        input: input,
	        value: "0.1*(input.intelligence+input.rank/10*20)/2*input.tacticspoints"
	    };
	
	    return jsonSL(generator)
	}
	
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
	    value: self.share.biometrics.rank * 2,
	});
	
	self.state.regenerateSkills = function () {
	    for (let label in skills) {
	        let val = self.state.skills[label];
	        if (label === "tactics") {
	            $(`#skills .slider-container:has([name=${label}])`).
	                siblings('.proficiency').text(calcTactics(val).toFixed(2));
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
	    let input;
	    let attr = self.share.attributes;
	    let biometrics = self.share.biometrics;
	    if (!attr || !biometrics) {
	        input = {
	            "skill": skill,
	            "skillpointsspent": val,
	            "skillvalue": 0,
	            "dexterity": 10,
	            "endurance": 10,
	            "perception": 10,
	            "strength": 10,
	            "vitality": 10,
	            "willpower": 10,
	            "intelligence": 10,
	            "rank": 1,
	            "tacticspoints": 0
	        };
	    } else {
	        input = {
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
	        };
	    }
	    let generator = {
	        "input": input,
	
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
	    "tactics": 10,
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
	    if (label === "tactics") {
	        skillMaxes.tactics = 10;
	    }
	    if (skillMaxes[label] === undefined) {
	        skillMaxes[label] = 16;
	    }
	    //console.log("skillmax:", label, skillMaxes[label], result.skillmax);
	    $(`#skills .slider[name=${label}]`).
	        children('.custom-handle').text(skills[label]);
	
	    $(`#skills .slider-container:has([name=${label}])>.max`).
	        text(skillMaxes[label]);
	
	    self.state.skills.mk({
	        property: label,
	        value: 0,
	        preset: (o, name, val) => {
	            
	            if (o[name] === val) {
	                //console.log("ignoring update:", name, o[name], val);
	                return;
	            }
	            //console.log('skill change:', name, o[name], val);
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
	            //console.log('skill points:', skillPoints);
	            if (skillPoints < 0 && val > o[name]) {
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
	                let tacticsVal = calcTactics(val);
	                //console.log('tac val:', tacticsVal);
	                $(`#skills .slider-container:has([name=${name}])`).
	                    siblings('.proficiency').text(tacticsVal.toFixed(2));
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
	    //console.log("skills:",data);
	    totalSkillPoints = data.skillPoints;
	    self.state.skillPoints = data.skillPoints;
	    let t = 120;
	    for (let label in skills) {
	        if (label in data) {
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
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype;

    window.modules.navigation.prototype.modules.settings.prototype.parent = window.modules.navigation.prototype;
    window.modules.navigation.prototype.modules.settings.prototype.state = {};
    window.modules.navigation.prototype.modules.settings.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.settings.prototype.loaded = false;
    window.modules.navigation.prototype.modules.settings.prototype.control={};
window.modules.navigation.prototype.modules.settings.prototype.control.dialog=function() {
        const self = this;
	
	self.state.dialog.dialog({
	    autoOpen: false,
	    modal: true,
	    width: 720,
	    show: {
	        effect: 'puff',
	        duration: 250
	    }, 
	    hide: {
	        effect: 'puff',
	        duration: 250
	    },
	    beforeClose () {
	        delete self.share.query.soundSettings;
	    },
	    close () {
	        self.share.sounds.bow.play();
	    },
	    create () {
	        self.share.eventLoop.when(() => (
	                self.share.query.soundSettings === true &&
	                !$('#user-settings-dialog').dialog('isOpen')
	            ), () => {
	            $('#user-settings-dialog').dialog('open');
	        });
	    },
	    open () {
	        self.share.query.soundSettings = true;
	        self.share.sounds.switch.play();
	        $('.ui-widget-overlay').one('click', () => $(this).dialog('close'));
	    }
	});
    };
    window.modules.navigation.prototype.modules.settings.prototype.control.dialog.prototype = window.modules.navigation.prototype.modules.settings.prototype;
window.modules.navigation.prototype.modules.settings.prototype.control.sliders=function() {
        const self = this;
	const settings = self.state.settings;
	
	self.state.dialog.on('dialogcreate', () => {
	    $('#user-settings-dialog .slider[name=master-sound]').slider({
	        value: 0,
	        min: 0,
	        max: 1,
	        step: 1,
	        create () {
	            settings.on('set', 'masterSound', (target, prop, val) => {
	                $(this).
	                    slider('value', val).
	                    children('.custom-handle').text(val ? 'On' : 'Off');
	                return val;
	            });
	        },
	        slide (event, ui) {
	            settings.masterSound = ui.value;
	        },
	        animate: 'fast'
	    });
	
	    $('#user-settings-dialog .slider[name=master-volume]').slider({
	        value: 80,
	        min: 0,
	        max: 100,
	        step: 5,
	        create () {
	            settings.on('set', 'masterVolume', (target, prop, val) => {
	                $(this).slider('value', val);
	                return val;
	            });
	        },
	        slide (event, ui) {
	            settings.masterVolume = ui.value;
	        },
	        animate: 'fast'
	    });
	
	    $('#user-settings-dialog .slider[name=music-volume]').slider({
	        value: 80,
	        min: 0,
	        max: 100,
	        step: 5,
	        create () {
	            settings.on('set', 'musicVolume', (target, prop, val) => {
	                $(this).slider('value', val);
	                return val;
	            });
	        },
	        slide (event, ui) {
	            settings.musicVolume = ui.value;
	        },
	        animate: 'fast'
	    });
	
	    $('#user-settings-dialog .slider[name=fx-volume]').slider({
	        value: 80,
	        min: 0,
	        max: 100,
	        step: 5,
	        create: function() {
	            settings.on('set', 'fxVolume', (target, prop, val) => {
	                $(this).slider('value', val);
	                return val;
	            });
	        },
	        slide: function (event, ui) {
	            settings.fxVolume = ui.value;
	        },
	        animate: 'fast'
	    });
	});
    };
    window.modules.navigation.prototype.modules.settings.prototype.control.sliders.prototype = window.modules.navigation.prototype.modules.settings.prototype;
window.modules.navigation.prototype.modules.settings.prototype.control.sounds=function() {
        const self = this;
	
	$('body').on('click', '.user-settings-btn', function (e) {
	    self.state.dialog.dialog('open');
	});
	
	$('body').on('click', '.next,.previous,.ui-tab a', () => {
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
	})
	
	$('body').on('click', '.dice', () => {
	    function randomDie () {
	        return 1 + (3 * Math.random() << 0);
	    };
	    let r = randomDie();
	    let sound = self.share.sounds["dice" + r];
	    sound.play();
	});
    };
    window.modules.navigation.prototype.modules.settings.prototype.control.sounds.prototype = window.modules.navigation.prototype.modules.settings.prototype;
window.modules.navigation.prototype.modules.settings.prototype.display={};
window.modules.navigation.prototype.modules.settings.prototype.display.style=".user-settings-btn { width: 64px; height: 64px; padding: 0 0; margin: 0 0; display: block; position: absolute; right: 0px; top: 0px; background: rgba(255,255,255,0.5); border-radius: 64px; border: 1px outset rgb(255,255,255,0.5); cursor: pointer; } .user-settings-btn:hover { border: 1px outset rgb(255,255,255,1); } .user-settings-btn:active { border: 1px inset rgb(255,255,255,1); } #user-settings-dialog { width:420px; display: none; background: rgb(0,0,0,0.72); } #user-settings-dialog .note { font-size: 12px; color: #848484; font-family: arial; text-shadow: 0px 0px 0px rgba(255,255,255,0.72); } #user-settings-dialog [name=master-sound] { width: 60px; margin: 11.75px 40px; } #user-settings-dialog [name=master-volume], #user-settings-dialog [name=music-volume], #user-settings-dialog [name=fx-volume] { width: 360px; margin: 11.75px 40px; } #user-settings-dialog .slider .custom-handle { width: 3em; height: 1.6em; top: 50%; margin-top: -.8em; margin-left: -30px; text-align: center; line-height: 1.6em; } ul.userData { list-style: none; background-color: rgba(164, 148, 105, 0.36); margin: 50px 0; padding: 10px; border: 0.5px outset rgba(170, 130, 25, 0.32); border-radius: 3px; } ul.userData>li { display: flex; flex-direction: row; box-shadow: 2px 2px 5px rgba(0,0,0, 0.32); padding: 5px; margin: 5px; background: rgba(0, 0, 0, 0.32); } ul.userData>li>span { padding-top: 6px; flex: 2; }";
window.modules.navigation.prototype.modules.settings.prototype.display.view=$("<div id=\"user-settings-dialog\" title=\"Settings\"> <h2>Sound Settings</h2> <ul class=\"userData\"> <li> <span>Master Sound</span> <div class=\"slider\" name=\"master-sound\"> <div class=\"ui-slider-handle custom-handle\"> Off </div> </div> </li> <li> <span>Master Volume</span> <div class=\"slider\" name=\"master-volume\"> </div> </li> <li> <span>Music Volume</span> <div class=\"slider\" name=\"music-volume\"> </div> </li> <li> <span>Sound FX Volume</span> <div class=\"slider\" name=\"fx-volume\"> </div> </li> </ul> </div>");
window.modules.navigation.prototype.modules.settings.prototype.hook={};
window.modules.navigation.prototype.modules.settings.prototype.hook.comms=function() {
        const self = this;
	const state = self.state;
	let pendingMessage = true;
	
	let settings = self.state.settings = waject({
	    masterSound: 0,
	    masterVolume: 0,
	    musicVolume: 0,
	    fxVolume: 0,
	    serverSettings: {}
	});
	self.share.soundSettings = settings;
	
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
	
	function sendUpdate(target) {
	    target.serverSettings = {
	        masterSound: target.masterSound,
	        masterVolume: target.masterVolume,
	        musicVolume: target.musicVolume,
	        fxVolume: target.fxVolume
	    };
	    socket.emit('sound-settings', target.serverSettings);
	    pendingMessage = false;
	}
	
	// initialize settings state
	new self.hook.settingState;
	
	
	// Emit a socket sound-settings event.
	// This allows the server to stay in-sync
	// with the client when changes occur.
	settings.on('set', result => {
	    if (pendingMessage) {
	        return;
	    }
	    if (!self.share.utility.isServerUpdatable(result)) {
	        return;
	    }
	    pendingMessage = true;
	    if (self.share.mouseIsDown) {
	        $(document).one('mouseup', () => sendUpdate(result.target));
	    } else {
	        sendUpdate(result.target);
	    }
	});
	
	
	socket.on('sound-settings', serverSettings => {
	    settings.serverSettings = serverSettings;
	    settings['*'] = serverSettings;
	    pendingMessage = false;
	});
	
	socket.emit("sound-settings-ready");
    };
    window.modules.navigation.prototype.modules.settings.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.settings.prototype;
window.modules.navigation.prototype.modules.settings.prototype.hook.settingState=function() {
        const self = this;
	const settings = self.state.settings;
	
	function putBetween (min, max) {
	    return function (result) {
	
	        val = Math.round(parseInt(result.value));
	        if (val < min) {
	            val = min;
	        } else if (val > max) {
	            val = max;
	        } 
	
	        if (isNaN(val)) {
	            val = min;
	        }
	
	        result.value = val;
	    };
	}
	
	// Ensure masterSound is 0 or 1.
	settings.on('set', 'masterSound', putBetween(0, 1));
	
	// Emit a master-sound event 
	// This allows things outside of
	// this module to listen for changes.
	settings.on('set', 'masterSound', (result) => {
	    self.share.eventLoop.emit('master-sound', result.value);
	});
	
	// Enable/Disable all Audio
	settings.on('set', 'masterSound', (result) => {
	    if (result.value) {
	        Howler.mute(false);
	    }
	    if (!result.value) {
	        Howler.mute(true);
	    }
	});
	
	// Ensure masterVolume is between 0 and 100.
	settings.on('set', 'masterVolume', putBetween(0, 100));
	
	// Set Master Volume
	settings.on('set', 'masterVolume', (result) => {
	    Howler.volume(result.value / 100);
	});
	
	// Ensure musicVolume is between 0 and 100.
	settings.on('set', 'musicVolume', putBetween(0, 100));
	
	// Set Music Volume
	settings.on('set', 'musicVolume', (result) => {
	    self.share.sounds.music.volume(result.value / 100);
	});
	
	// Ensure fxVolume is between 0 and 100.
	settings.on('set', 'fxVolume', putBetween(0, 100));
	
	// Set Music Volume
	settings.on('set', 'fxVolume', (result) => {
	    let sounds = self.share.sounds;
	    for (let sound in sounds) {
	        if (sound === "music") {
	            continue;
	        }
	        sounds[sound].volume(result.value / 100);
	    }
	});
	
    };
    window.modules.navigation.prototype.modules.settings.prototype.hook.settingState.prototype = window.modules.navigation.prototype.modules.settings.prototype;

    window.modules.navigation.prototype.parent = window;
    window.modules.navigation.prototype.state = {};
    window.modules.navigation.prototype.share = __SHARE__;
    window.modules.navigation.prototype.loaded = false;
    window.modules.navigation.prototype.control={};
window.modules.navigation.prototype.control.events=function() {
        const self = this;
	
	let path = window.location.pathname;
	let hash = window.location.hash;
	let search = window.location.search;
	
	let eventLoop = self.share.eventLoop;
	
	self.share.query = new Proxy(
	    parseQueryString(search), 
	    {
	        get (o, name) {
	            if (name === "string") {
	                return packQuery(o);
	            }
	            return o[name];
	        },
	        set (o, name, val) {
	            if (name === "string") {
	                let q = parseQueryString(val);
	                for (let name in o) {
	                    delete o[name];
	                }
	                for (let name in q) {
	                    o[name] = q[name];
	                }
	            } else if (o[name] === val) {
	                return val;
	            } else {
	                o[name] = val;
	            }
	            let search = packQuery(o);
	            window.history.pushState(null, "", path + search + hash);
	            return true;
	        },
	        deleteProperty (o, name) {
	            delete o[name];
	            let search = packQuery(o);
	            window.history.pushState(null, "", path + search + hash);
	            return true;
	        }
	    }
	);
	
	function encode (str) {
	    return encodeURIComponent(("" + str).replace(/\s/g, '+'));
	}
	
	function decode (str) {
	    return decodeURIComponent(("" + str).replace(/\+/g, ' '));
	}
	
	function parseQueryString (query) {
	    let result = {}
	    if (query) {
	        if (/^[?#]/.test(query)) {
	            query = query.substr(1);
	        }
	        result = query.split('&').
	                reduce((result, param) => {
	                    let [key, value] = param.split('=');
	                    if (value !== undefined) {
	                        result[key] = decode(value);
	                    } else {
	                        result[key] = '';
	                    }
	                    if (result[key] === "true") {
	                        result[key] = true;
	                    }
	                    if (result[key] === "false") {
	                        result[key] = false;
	                    }
	                    return result;
	                }, result);
	    }
	    return result;
	};
	
	function packQuery () {
	    let result = "?";
	    for (let name in self.share.query) {
	        if (name === "toString") {
	            continue;
	        }
	        let value = self.share.query[name];
	        result += `${encode(name)}=${encode(value)}&`;
	    }
	    return result.substr(0, result.length - 1);
	}
	
	function handleNavigation () {
	    path = window.location.pathname;
	    hash = window.location.hash;
	    search = window.location.search;
	    let query = self.share.query;
	
	    $('#navigation li').removeClass('selected');
	
	    if (path.substring(1,10) === "gladiator") {
	        $('#navigation li.gladiator').addClass('selected');
	    }
	    if (query.settings) {
	        $('#navigation li.settings').addClass('selected');
	    }
	
	    if (hash === "") {
	        window.history.replaceState(null, "", path + search);
	    }
	}
	
	eventLoop.when(
	    () => (
	        window.location.pathname !== path ||
	        window.location.hash !== hash ||
	        window.location.search !== search
	    ), 
	    handleNavigation
	);
	
	self.share.eventLoop.on('master-sound', masterSound => {
	    if (masterSound) {
	        $('#navigation i.fa-volume-mute').
	            removeClass('fa-volume-mute').
	            addClass('fa-volume-up');
	    } else {
	        $('#navigation i.fa-volume-up').
	            removeClass('fa-volume-up').
	            addClass('fa-volume-mute');
	    }
	});
	
	handleNavigation();
	
	$(document).on('click', ':not(a,link)[href]', function (e) {
	    let p = path;
	    let s = self.share.query.string;
	    let h = hash;
	
	    let href = $(this).attr('href');
	
	    e.preventDefault();
	    if (href[0] === "#") {
	        h = href;
	    } else if (href[0] === "?") {
	        self.share.query.string = href;
	        return;
	    }  else if (href[0] === "&") {
	        if (self.share.query.string.length === 0) {
	            href = href.replace('&', '?');
	        }
	        self.share.query.string += href;
	        return;
	    } else {
	        p = href;
	    }
	    let target = p + s + h;
	    window.history.pushState(null, "", target);
	});
	
    };
    window.modules.navigation.prototype.control.events.prototype = window.modules.navigation.prototype;
window.modules.navigation.prototype.display={};
window.modules.navigation.prototype.display.style="#navigation { width: 100%; background: rgba(0,0,0,0.72); display: flex; flex-direction: column; flex-flow: row; justify-content: space-between; } #navigation ul.nav-left>li { border-right: 1px solid rgba(255, 255, 255, 0.32); } #navigation ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: row; } #navigation ul>li { padding: 10px; margin: 0; cursor: pointer; } #navigation ul>li:hover, #navigation ul>li.selected { color: rgb(170, 130, 25); background: rgb(0,0,0); } ";
window.modules.navigation.prototype.display.view=$("<div id=\"navigation\"> <ul class=\"nav-left\"> <li title=\"Create Your Next Legend.\" href=\"gladiator-culture\"> Create Gladiator </li> <li title=\"(Not Yet Implemented) &nbsp; &nbsp; &nbsp; &nbsp; An Overview of Your Saved Fighters.\"> My Gladiators </li> </ul> <ul class=\"nav-right\"> <li title=\"(Not Yet Implemented) &nbsp; &nbsp; &nbsp; &nbsp; Your Blood &amp; Sand Account.\" href=\"&account=true\"> <i class=\"fas fa-user\"></i> </li> <li title=\"Adjust Sound Settings.\" class=\"sound\" href=\"&soundSettings=true\"> <i class=\"fas fa-volume-mute\"></i> </li> </ul> </div>");
window.modules.utility = function () {
        const self = this;
	
	if (!self.loaded) {
	    self.share.utility = {};
	    new self.manipulators.waject;
	    new self.functions.isServerUpdatable;
	}
    };
    window.modules.navigation.prototype.modules = {
        share: __SHARE__,
        fetch: function (name) {
            let m = new this[name];
            this[name].prototype.loaded = true;
            return m;
        }
    };
window.modules.navigation.prototype.modules.gladiator = function () {
        const self = this;
	
	if (!self.loaded) {
	    $('head').append("<style>" + self.display.style + "</style>");
	    $('#game').append(self.display.view);
	    new self.control.events();
	}
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules = {
        share: __SHARE__,
        fetch: function (name) {
            let m = new this[name];
            this[name].prototype.loaded = true;
            return m;
        }
    };
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes = function () {
        const self = this;
	
	if (!self.loaded) {
	    new self.hook.comms();
	    new self.control.events();
	}
	
    };
    
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.parent = window.modules.navigation.prototype.modules.gladiator.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.control.events=function() {
        const self = this;
	const eventLoop = self.share.eventLoop;
	const attributes = self.state.attributes;
	const modifiers = self.state.modifiers;
	let cultureSettings;
	
	function updateSliders() {
	    Object.keys(attributes).forEach(prop => {
	        if (prop === "serverSettings") {
	            return;
	        }
	        $(`#attributes [name=${prop}]`).
	            slider('value', attributes[prop]).
	            children('.custom-handle').
	            text(attributes[prop]);
	    });
	}
	
	eventLoop.after(() => (
	        !cultureSettings &&
	        (cultureSettings = self.share.cultureSettings)
	    ), () => {
	        cultureSettings.bindInput('name', 
	            $('#attributes [name=name]')
	        );
	});
	
	$( "#attributes .slider" ).slider({
	    create: function() {
	        $(this).children('.custom-handle').text( $(this).slider("value"));
	    },
	    slide: function( event, ui ) {
	        let name = $(this).attr('name');
	        if (ui.value > attributes[name]) {
	            let diff = ui.value - attributes[name];
	            if ((attributes.abilitySum + diff) > 91) {
	                return false;
	            }
	        }
	        
	        $(this).children('.custom-handle').text(ui.value);
	        
	    },
	    min: 3,
	    max: 18,
	    animate: 'slow'
	});
	$('#attributes [name=abilitySum]').
	    slider('option', 'max', 91).
	    slider('option', 'min', 21);
	
	$('#attributes .randomizeAttributes').on('click', e => {
	    let sum = attributes.abilitySum;
	    self.state.ignoreUpdate = true;
	    attributes.abilitySum = 21;
	    self.state.ignoreUpdate = false;
	    attributes.abilitySum = sum;
	    updateSliders();
	});
	
	$('#attributes ul>li .slider').each(function () {
	    let name = $(this).attr('name');
	
	    attributes.bindInput({
	        property: name,
	        element: $(this),
	        event: 'slidestop',
	        outHandler (element, value) {
	            element.
	                slider('value', value).
	                children('.custom-handle').
	                    text(value);
	        },
	        inHandler (element, proxy, prop) {
	            proxy[prop] = element.slider('value');
	            return updateSliders();
	        }
	    });
	});
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.control.modifiers=function() {
        const self = this;
	
	const modifiers = self.state.modifiers;
	$('#attributes ul>li .slider').each(function () {
	    let name = $(this).attr('name');
	    let fieldTooltip = "";
	    let slider = $(`#attributes [name=${name}`);
	    if (name in modifiers.final) {
	        slider.siblings('.final').text(modifiers.final[name]);
	    }
	
	    if (name in modifiers.age) {
	        if (modifiers.age[name] > 0) {
	            fieldTooltip += "+"
	        }
	        fieldTooltip += `${modifiers.age[name]} from age, `;
	    }
	
	    if (name in modifiers.bmi) {
	        if (modifiers.bmi[name] > 0) {
	            fieldTooltip += "+"
	        }
	        fieldTooltip += `${modifiers.bmi[name]} from BMI, `;
	    }
	
	    if (name in modifiers.sex) {
	        if (modifiers.sex[name] > 0) {
	            fieldTooltip += "+"
	        }
	        fieldTooltip += `${modifiers.sex[name]} from sex, `;
	    }
	
	    fieldTooltip = fieldTooltip.substr(0, fieldTooltip.length - 2);
	    if (fieldTooltip.length > 0) {
	        fieldTooltip += ".";
	    }
	    slider.parent('li').attr('title', fieldTooltip);
	});
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.control.modifiers.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.display.box=$("<div id=\"attributes\" class=\"item\"> <span> <img title=\"Don't have time for this? Generate random Attributes.\" src=\"/img/dice.png\" class=\"randomizeAttributes dice\"> Attributes For <input name=\"name\" value=\"Name Your Gladiator\"> </span> <ul class=\"gladiatorData\"> <li> <span class=\"label\">strength</span> <div class=\"slider\" name=\"strength\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">dexterity</span> <div class=\"slider\" name=\"dexterity\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">perception</span> <div class=\"slider\" name=\"perception\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">endurance</span> <div class=\"slider\" name=\"endurance\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">intelligence</span> <div class=\"slider\" name=\"intelligence\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">willpower</span> <div class=\"slider\" name=\"willpower\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">vitality</span> <div class=\"slider\" name=\"vitality\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span>ability sum</span> <div class=\"slider\" name=\"abilitySum\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> </li> </ul> </div>");
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.display.style="#attributes div < button[name=\"attributesNext\"] { display: block; } #attributes button[name=\"attributesPrevious\"] { display: block; float: left; } #attributes ul>li>.label { flex: 7; } #attributes ul>li>.final { flex: 2; } #attributes .slider { width: 480px; margin: 11.75px 40px; } #attributes input[name=\"name\"] { width: 57%; } #attributes button[name=\"attributesNext\"] { display: block; float: right; }";
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.hook={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.hook.comms=function() {
        const self = this;
	
	const MAX_ABILITY_SUM = 91;
	const MAX_STAT_SIZE = 18;
	const MIN_STAT_SIZE = 3;
	
	const attributes = waject({
	    strength: MIN_STAT_SIZE,
	    dexterity: MIN_STAT_SIZE,
	    perception: MIN_STAT_SIZE,
	    endurance: MIN_STAT_SIZE,
	    intelligence: MIN_STAT_SIZE,
	    willpower: MIN_STAT_SIZE,
	    vitality: MIN_STAT_SIZE,
	    abilitySum: MIN_STAT_SIZE * 7,
	    serverSettings: {}
	});
	
	const updatable = self.share.utility.isServerUpdatable;
	self.state.ignoreUpdate = false;
	
	function randomProperty (obj, f = () => true) {
	    var keys = Object.keys(obj).filter(f);
	    return  keys[keys.length * Math.random() << 0];
	};
	attributes.on('set', 'abilitySum', (result) => {
	    let target = result.target;
	    let val = result.value;
	    let prop = result.key;
	
	    if (isNaN(val)) {
	        result.value = target[prop];
	        result.cycle = false;
	        return;
	    }
	    let attrPool = {};
	    Object.keys(target).forEach(prop => {
	        if (prop === "abilitySum" || 
	            prop === "serverSettings") {
	            return;
	        }
	        attrPool[prop] = target[prop];
	    });
	    if (val > target.abilitySum) {
	        if (val > MAX_ABILITY_SUM) {
	            val = MAX_ABILITY_SUM;
	        }
	        let diff = val - target.abilitySum;
	        while (diff > 0) {
	            let randProp = randomProperty(attrPool);
	            if (target[randProp] >= MAX_STAT_SIZE) {
	                delete attrPool[randProp];
	                continue;
	            }
	            target[randProp] += 1;
	            diff -= 1;
	        }
	        result.value = val;
	        return;
	    }
	    if (val < target.abilitySum) {
	        if (val < (MIN_STAT_SIZE * 7)) {
	            val = MIN_STAT_SIZE * 7;
	        }
	        let diff = target.abilitySum - val;
	        while (diff > 0) {
	            let randProp = randomProperty(attrPool);
	            if (target[randProp] <= MIN_STAT_SIZE) {
	                delete attrPool[randProp];
	                continue;
	            }
	            target[randProp] -= 1;
	            diff -= 1;
	        }
	        result.value = val;
	        return;
	    }
	});
	
	attributes.on('set', (result) => {
	    let target = result.target;
	    let val = result.value;
	    let prop = result.key;
	    if (prop === "serverSettings") {
	        return;
	    }
	
	    if (prop === "abilitySum") {
	        return;
	    }
	
	    if (isNaN(val)) {
	        result.value = target[prop];
	        result.cycle = false;
	        return;
	    }
	
	    if (val > target[prop]) {
	        if (val > MAX_STAT_SIZE) {
	            val = MAX_STAT_SIZE;
	        }
	        let diff = val - target[prop];
	        if ((target.abilitySum + diff) > MAX_ABILITY_SUM) {
	            diff -= (target.abilitySum + diff) - MAX_ABILITY_SUM;
	        }
	        result.value = target[prop] + diff;
	        target.abilitySum += diff;
	        return;
	    }
	
	    if (val < target[prop]) {
	        if (val < MIN_STAT_SIZE) {
	            val = MIN_STAT_SIZE;
	        }
	        let diff = target[prop] - val;
	        result.value = target[prop] - diff;
	        target.abilitySum -= diff;
	        return;
	    }
	});
	
	self.state.attributes = attributes;
	self.share.attributeSettings = attributes;
	self.state.modifiers = {
	    age: {},
	    bmi: {},
	    sex: {},
	    final: {}
	};
	
	attributes.on('set', (result) => {
	    if (self.state.ignoreUpdate || 
	        !updatable(result)) {
	        return;
	    }
	    self.state.ignoreUpdate = true;
	    let update = {};
	    Object.keys(attributes).forEach(prop => {
	        if (prop === "serverSettings") {
	            return;
	        }
	        if (prop === result.key) {
	            update[prop] = result.value;
	            return;
	        }
	        update[prop] = attributes[prop];
	    });
	    attributes.serverSettings = update;
	    socket.emit("gladiator-attributes-change", update);
	    self.state.ignoreUpdate = false;
	});
	
	socket.on("gladiator-attributes", data => {
	    let serverSettings = {};
	    let same = true;
	    for (prop in data) {
	        if (prop === "abilitySum" ||
	            prop === "modifiers") {
	            continue;
	        }
	        serverSettings[prop] = data[prop];
	        if (data[prop] !== attributes[prop]) {
	            attributes[prop] = data[prop];
	            same = false;
	        }
	    }
	    if (!same) {
	        attributes.abilitySum = attributes.abilitySum;
	        serverSettings.abilitySum = attributes.abilitySum;
	        attributes.serverSettings = serverSettings;
	    }
	
	    self.state.modifiers.age = data.modifiers.age;
	    self.state.modifiers.bmi = data.modifiers.bmi;
	    self.state.modifiers.sex = data.modifiers.sex;
	    self.state.modifiers.final = data.modifiers.final;
	    new self.control.modifiers;
	});
	
	socket.emit("gladiator-attributes-ready");
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics = function () {
        const self = this;
	
	if (!self.loaded) {
	    new self.hook.comms();
	    new self.control.events();
	}
	
    };
    
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.parent = window.modules.navigation.prototype.modules.gladiator.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.control.events=function() {
        const self = this;
	const biometrics = self.state.biometrics;
	const eventLoop = self.share.eventLoop;
	let cultureSettings;
	$('#biometrics select').selectric();
	
	eventLoop.after(() => (
	        !cultureSettings &&
	        (cultureSettings = self.share.cultureSettings)
	    ), () => {
	        cultureSettings.bindInput('name', 
	            $('#biometrics [name=name]')
	        );
	        cultureSettings.bindInput({
	            property: 'culture',
	            element: $('#biometrics [name=culture]'),
	            outHandler: (element, val) => 
	                $(element).val(val).selectric()
	        });
	        cultureSettings.bindInput({
	            property: 'sex',
	            element: $('#biometrics [name=sex]'),
	            outHandler: (element, val) => 
	                $(element).val(val).selectric()
	        });
	});
	
	$('#biometrics ul>li input').each(function () {
	    biometrics.bindInput(this.name, this);
	});
	
	$('#biometrics').on(
	    'click', 
	    '.randomizeBiometrics', 
	    self.state.requestBiometrics
	);
	
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.display.box=$("<div id=\"biometrics\" class=\"item\"> <span> <img title=\"Don't Like These? Generate new Biometrics. This will not overwrite culture, sex, rank or name.\" src=\"/img/dice.png\" class=\"randomizeBiometrics dice\"> Biometrics For <input name=\"name\" value=\"Name Your Gladiator\"> </span> <ul class=\"gladiatorData\"> <li> <span>Culture</span> <select class=\"stat\" name=\"culture\"> <option>roman</option> <option>gallic</option> <option>germanic</option> <option>syrian</option> <option>numidian</option> <option>thracian</option> <option>greek</option> <option>iberian</option> <option>judean</option> <option>scythian</option> </select> </li> <li> <span>Sex</span> <select class=\"stat\" name=\"sex\"> <option>male</option> <option>female</option> </select> </li> <li> <span>Rank</span> <input type=\"number\" class=\"stat\" name=\"rank\" min=1 max=15> </li> <li> <span>Age</span> <input type=\"number\" class=\"stat\" name=\"age\" readonly> </li> <li> <span>Weight</span> <input type=\"number\" class=\"stat\" name=\"weight\" readonly> </li> <li> <span>Height</span> <input type=\"number\" class=\"stat\" name=\"height\" readonly> </li> <li> <span>BMI</span> <input type=\"number\" class=\"stat\" name=\"bmi\" readonly> </li> <li> <span>Reach</span> <input type=\"number\" class=\"stat\" name=\"reach\" readonly> </li> </ul> </div>");
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.display.style="div < button[name=\"biometricsNext\"] { display: block; } button[name=\"biometricsPrevious\"] { display: block; float: left; } #biometrics input[name=\"name\"] { width: 50%; } #biometrics select { width: 150px; } button[name=\"biometricsNext\"] { display: block; float: right; }";
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.hook={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.hook.comms=function() {
        const self = this;
	
	const biometrics = waject({
	    culture: 0,
	    sex: 0,
	    rank: 0,
	    age: 0,
	    weight: 0,
	    height: 0,
	    bmi: 0,
	    reach: 0
	});
	
	let serverRank;
	
	const biometricLabels = Object.keys(biometrics);
	biometricLabels.splice(biometricLabels.indexOf("serverSettings"), 1);
	
	self.share.biometricSettings = biometrics;
	self.state.biometrics = biometrics;
	
	self.state.requestBiometrics = function () {
	    console.log("requesting biometrics..");
	    socket.emit("gladiator-biometrics-generate");
	}
	
	biometrics.on('set', 'rank', (target, prop, val) => {
	    if (serverRank === undefined) {
	        return;
	    }
	    val = parseInt(val);
	    if (val < 1 || val > 15 || isNaN(val)) {
	        requestAnimationFrame(() => (biometrics.rank = serverRank));
	        return false;
	    }
	    target[prop] = val;
	    if (serverRank === val) {
	        return;
	    }
	    serverRank = val;
	    socket.emit('gladiator-biometrics-rank', val);
	});
	
	socket.on("gladiator-biometrics", data => {
	    biometrics['*'] = data;
	    serverRank = data.rank;
	});
	
	socket.emit("gladiator-biometrics-ready");
	
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats = function () {
        const self = this;
	
	if (!self.loaded) {
	    //new self.hook.comms();
	    //new self.control.events();
	} else {
	    //socket.emit("gladiator-combatStats-generate");
	}
    };
    
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.parent = window.modules.navigation.prototype.modules.gladiator.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.control.events=function() {
        const self = this;
	
	$('#combatStats [name=name]').val(self.share.name);
	
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.display.box=$("<div id=\"combatStats\" class=\"item\"> <span> Combat Statistics For <input name=\"name\" value=\"Name Your Gladiator\"> </span> <ul class=\"gladiatorData\"> <li title=\"Affected by endurance, lifestyle, rank, vitality, weight, and willpower.\"> <span>Health</span> <input type=\"number\" class=\"stat\" name=\"health\" readonly> </li> <li title=\"Affected by endurance, lifestyle, rank, vitality, willpower.\"> <span>Stamina</span> <input type=\"number\" class=\"stat\" name=\"stamina\" readonly> </li> <li> <span>Stamina Recovery</span> <input type=\"number\" class=\"stat\" name=\"staminaRecovery\" readonly> </li> <li> <span>Initiative</span> <input type=\"number\" class=\"stat\" name=\"initiative\" readonly> </li> <li> <span>Nerve</span> <input type=\"number\" class=\"stat\" name=\"nerve\" readonly> </li> <li> <span>Offense</span> <input type=\"number\" class=\"stat\" name=\"offense\" readonly> </li> <li> <span>Defense</span> <input type=\"number\" class=\"stat\" name=\"defense\" readonly> </li> <li> <span>Dodge</span> <input type=\"number\" class=\"stat\" name=\"dodge\" readonly> </li> <li> <span>Parry</span> <input type=\"number\" class=\"stat\" name=\"parry\" readonly> </li> </ul> </div>");
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.display.style="div < button[name=\"combatStatsNext\"] { display: block; } button[name=\"combatStatsPrevious\"] { display: block; float: left; } #combatStats input[name=\"name\"] { width: 50%; } #combatStats select { width: 150px; } button[name=\"combatStatsNext\"] { display: block; float: right; }";
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.hook={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.hook.comms=function() {
        const self = this;
	
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
	    combatStatsLabels.forEach(name => {
	        if (name in data) {
	            let val = data[name];
	            if (/\./.test("" + val)) {
	                val = val.toFixed(2);
	            }
	            $(`[name="${name}"]`).val(val);
	        }
	    });
	});
	
	socket.emit("gladiator-combatStats-ready");
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture = function () {
        const self = this;
	if (!self.loaded) {
	    new self.hook.comms();
	    new self.control.events();
	}
    };
    
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.parent = window.modules.navigation.prototype.modules.gladiator.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.control.events=function() {
        const self = this;
	
	const settings = self.state.settings;
	
	function getRandomInt(min, max) {
	    min = Math.ceil(min);
	    max = Math.floor(max);
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	function generateName () {
	    if (!settings.culture || !settings.sex) {
	        return;
	    }
	    let ref = self.state.names[settings.culture]
	    if (ref) {
	        ref = ref[settings.sex];
	    }
	    if (!ref) {
	        return;
	    }
	    let randName = ref[Math.floor(Math.random()*ref.length)];
	    settings.name = randName;
	};
	
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
	
	settings.bindInput('name', 
	    $('#culture [name=name]')
	);
	settings.bindInput({
	    property: 'culture',
	    element: $('#culture [name=culture]'),
	    outHandler: (element, val) => 
	        $(element).val(val).selectric()
	});
	settings.bindInput({
	    property: 'sex',
	    element: $('#culture [name=sex]'),
	    outHandler: (element, val) => 
	        $(element).val(val).selectric()
	});
	
	$('#culture select').selectric();
	
	$('#culture').on('click', '.randomizeName', e => {
	    generateName();
	});
	$('#culture').on('click', '.randomizeCulture', e => {
	    let randCulture = getRandomInt(0, 9);
	    let randSex = getRandomInt(0, 1);
	    settings.culture = cultures[randCulture];
	    settings.sex = sexes[randSex];
	    generateName();
	});
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.display.box=$("<div id=\"culture\" class=\"item\"> <span> <img title=\"Randomly Generate Culture, Sex and Name.\" src=\"/img/dice.png\" class=\"randomizeCulture dice\"> Culture of <input name=\"name\" placeholder=\"Name This Fighter\"> </span> <ul class=\"gladiatorData\"> <li> <span>Culture</span> <select class=\"stat\" name=\"culture\"> <option>roman</option> <option>gallic</option> <option>germanic</option> <option>syrian</option> <option>numidian</option> <option>thracian</option> <option>greek</option> <option>iberian</option> <option>judean</option> <option>scythian</option> </select> </li> <li> <span>Sex</span> <select class=\"stat\" name=\"sex\"> <option>male</option> <option>female</option> </select> </li> <li> <span> Name <img title=\"Randomly Generate a name based on The Fighter's Culture and Sex.\" src=\"/img/dice.png\" class=\"randomizeName dice\"> </span> <input class=\"stat\" name=\"name\"> </li> </ul> </div>");
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.display.style="div < button[name=\"cultureNext\"] { display: block; } #culture input[name=\"name\"] { width: 450px; } button[name=\"cultureNext\"] { display: block; float:right; } ";
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.hook={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.hook.comms=function() {
        const self = this;
	
	let updatable = self.share.utility.isServerUpdatable;
	
	self.state.settings = waject({
	    name: '',
	    culture: '',
	    sex: '',
	    serverSettings: {}
	});
	let settings = self.state.settings;
	self.share.cultureSettings = settings;
	
	self.state.names = {};
	
	function updateServer(result) {
	    let target = result.target;
	    target[result.key] = result.value;
	    for (setting in target.serverSettings) {
	        val = target.serverSettings[setting];
	        if (val !== target[setting]) {
	            target.serverSettings[setting] = target[setting];
	            socket.emit(`gladiator-${setting}`, target[setting]);
	        }
	    }
	}
	
	settings.on('set', (result) => {
	    if (!updatable(result)) {
	        return;
	    }
	    updateServer(result);
	});
	
	socket.emit("gladiator-culture-ready");
	
	socket.on("gladiator-names", d => {
	    self.state.names = d;
	});
	socket.on("gladiator-culture-info", d => {
	    self.state.cultureInfo = d;
	});
	socket.on("gladiator-name", d => {
	    settings.serverSettings.name = d;
	    settings.name = d;
	});
	socket.on("gladiator-sex", d => {
	    settings.serverSettings.sex = d;
	    settings.sex = d;
	});
	socket.on("gladiator-culture", d => {
	    settings.serverSettings.culture = d;
	    settings.culture = d;
	});
	
	
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills = function () {
        const self = this;
	
	if (!self.loaded) {
	    //new self.hook.comms();
	    //new self.control.events();
	} else {
	    //self.state.regenerateSkills();
	}
	
    };
    
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.parent = window.modules.navigation.prototype.modules.gladiator.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.control.events=function() {
        const self = this;
	
	socket.on('gladiator-rank', data => {
	    let rank = data;
	    let rankMax = rank * 2;
	    for (let label in self.share.skillMaxes) {
	        let skillMax = self.share.skillMaxes[label];
	        let max = (rankMax < skillMax) ? rankMax : skillMax;
	        $(`#skills .slider-container:has(.slider[name=${label}])`).
	                attr('title', `Maximum of ${max} for rank ${rank}`);
	    }
	});
	
	$( "#skills .slider" ).slider({
	    create: function() {
	        let name = $(this).attr('name');
	        let max = self.share.skillMaxes[name];
	        let rank = self.share.biometrics.rank || 1;
	        let rankMax = rank * 2;
	        $('#skills .slider-container').attr('title', `Maximum of ${rankMax} for rank ${rank}`);
	        $(this).slider('option', 'max', max);
	        $(this).children('.custom-handle').text( $(this).slider("value"));
	    },
	    slide: function( event, ui ) {
	        
	        let name = $(this).attr('name');
	        let max = $(this).slider('option', 'max');
	        let highestPoint = self.state.skillPoints + $(this).slider('value');
	        let rank = self.share.biometrics.rank || 1;
	        let rankMax = rank * 2;
	        let skillCeiling = rankMax;
	        if (skillCeiling < highestPoint) {
	            highestPoint = skillCeiling;
	        }
	        if (max < highestPoint) {
	            highestPoint = max;
	        }
	        
	        if (ui.value > highestPoint) {
	            ui.value = highestPoint;
	        }
	        $(this).children('.custom-handle').text(ui.value);
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
	        if (ui.value !== self.state.skills[name]) {
	            $(this).slider('option', 'value', self.state.skills[name]);
	        }
	    },
	    min: 0,
	    max: 16,
	    animate: 'slow'
	});
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.display.box=$("<div id=\"skills\" class=\"item\"> <span> Skills For <input name=\"name\" value=\"Name Your Gladiator\"> </span> <div> <span>Skill Points:</span> <span name=\"skillPoints\">10</span> </div> <ul class=\"gladiatorData\"> <li> <span>tactics</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"tactics\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\">n</span> <span class=\"description\">Abyssmal</span> </li> <li> <span>dodge</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"dodge\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>parry</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"parry\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>shield</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"shield\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>bash</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"bash\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>charge</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"charge\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>spear</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"spear\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>light Blade</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"lightBlade\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>heavy Blade</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"heavyBlade\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>bludgeoning</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"bludgeoning\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>axe</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"axe\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>riposte</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"riposte\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>close Combat</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"closeCombat\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>feint</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"feint\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>dirty Trick</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"dirtyTrick\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>appraise</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"appraise\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> </ul> </div>");
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.display.style="#skills div < button[name=\"skillsNext\"] { display: block; } #skills button[name=\"skillsPrevious\"] { display: block; float: left; } #skills .slider { width: 200px; margin: 11.75px 40px; } #skills input[name=\"name\"] { width: 57%; } #skills button[name=\"skillsNext\"] { display: block; float: right; color: rgba(255,255,255,0.72); } #skills .proficiency { text-align: center; } #skills .slider-container { color: rgba(170, 130, 25, 0.5); background: rgba(0, 0, 0, 0.32); border: 1px solid rgba(0,0,0,0.72); padding-left: 5px; padding-right: 5px; display: flex; flex-direction: row; width: 350px; } #skills .min { text-align: right; } #skills .max { text-align: left; } #skills .max, #skills .min { flex-grow: 0; padding-top: 8px; } #skills ul.gladiatorData>li>span:nth-child(1) { flex-grow: 3; }";
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.hook={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.hook.comms=function() {
        const self = this;
	let skillCeiling = 16;
	let totalSkillPoints = 0;
	
	function calcTactics (val) {
	    let input = {
	        intelligence: self.share.attributes.intelligence,
	        rank: self.share.biometrics.rank,
	        tacticspoints: val
	    };
	    let generator = {
	        input: input,
	        value: "0.1*(input.intelligence+input.rank/10*20)/2*input.tacticspoints"
	    };
	
	    return jsonSL(generator)
	}
	
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
	    value: self.share.biometrics.rank * 2,
	});
	
	self.state.regenerateSkills = function () {
	    for (let label in skills) {
	        let val = self.state.skills[label];
	        if (label === "tactics") {
	            $(`#skills .slider-container:has([name=${label}])`).
	                siblings('.proficiency').text(calcTactics(val).toFixed(2));
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
	    let input;
	    let attr = self.share.attributes;
	    let biometrics = self.share.biometrics;
	    if (!attr || !biometrics) {
	        input = {
	            "skill": skill,
	            "skillpointsspent": val,
	            "skillvalue": 0,
	            "dexterity": 10,
	            "endurance": 10,
	            "perception": 10,
	            "strength": 10,
	            "vitality": 10,
	            "willpower": 10,
	            "intelligence": 10,
	            "rank": 1,
	            "tacticspoints": 0
	        };
	    } else {
	        input = {
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
	        };
	    }
	    let generator = {
	        "input": input,
	
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
	    "tactics": 10,
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
	    if (label === "tactics") {
	        skillMaxes.tactics = 10;
	    }
	    if (skillMaxes[label] === undefined) {
	        skillMaxes[label] = 16;
	    }
	    //console.log("skillmax:", label, skillMaxes[label], result.skillmax);
	    $(`#skills .slider[name=${label}]`).
	        children('.custom-handle').text(skills[label]);
	
	    $(`#skills .slider-container:has([name=${label}])>.max`).
	        text(skillMaxes[label]);
	
	    self.state.skills.mk({
	        property: label,
	        value: 0,
	        preset: (o, name, val) => {
	            
	            if (o[name] === val) {
	                //console.log("ignoring update:", name, o[name], val);
	                return;
	            }
	            //console.log('skill change:', name, o[name], val);
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
	            //console.log('skill points:', skillPoints);
	            if (skillPoints < 0 && val > o[name]) {
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
	                let tacticsVal = calcTactics(val);
	                //console.log('tac val:', tacticsVal);
	                $(`#skills .slider-container:has([name=${name}])`).
	                    siblings('.proficiency').text(tacticsVal.toFixed(2));
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
	    //console.log("skills:",data);
	    totalSkillPoints = data.skillPoints;
	    self.state.skillPoints = data.skillPoints;
	    let t = 120;
	    for (let label in skills) {
	        if (label in data) {
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
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype;

    window.modules.navigation.prototype.modules.gladiator.prototype.parent = window.modules.navigation.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.control.events=function() {
        const self = this;
	
	let activeTab = 0;
	const baseTitle = "Blood & Sand";
	const baseContent = document.getElementsByTagName('html')[0].outerHTML;
	let stateLoad = false;
	
	function setWindowTitle (url) {
	    url = url.replace('/', '');
	    let parts = url.split('-');
	    let title = baseTitle + " |";
	    parts.forEach((part, i) => {
	        let newPart = "";
	        for (let i = 0; i < part.length; i += 1) {
	            if (i === 0) {
	                newPart = " " + part[i].toUpperCase();
	            } else if (part[i] === part[i].toUpperCase()) {
	                newPart += " " + part[i];
	            } else {
	                newPart += part[i]
	            }
	        }
	        title += newPart;
	    });
	    document.title = title;
	}
	
	$('#gladiator ul>li:has(a[href])').each(function (i) {
	    let id = $(this).children('a').attr('href').replace('#', '');
	    if (!(id in self.modules)) {
	        return;
	    }
	    $('head').append('<style>' + self.modules[id].prototype.display.style + '</style>');
	    $('#gladiator').append(self.modules[id].prototype.display.box);
	    self.modules.fetch(id);
	    if (window.location.pathname === ('/gladiator-' + id)) {
	        setWindowTitle('gladiator-' + id);
	        activeTab = i;
	    }
	});
	
	if (activeTab === 0) {
	    setWindowTitle('gladiator-culture');
	    window.history.replaceState({
	        id: '#culture'
	    }, baseTitle + " | gladiator culture", "gladiator-culture" + location.search + location.hash);
	}
	self.modules.fetch('culture');
	
	$('#gladiator').tabs({
	    active: activeTab,
	    beforeActivate (event, ui) {
	        let newUrl = ui.newTab.children('a').attr('href').replace("#", "gladiator-");
	        let content = baseContent;
	        setWindowTitle(newUrl);
	        if (!stateLoad) {
	            window.history.pushState({
	                id: ui.newTab.children('a').attr('href')
	            }, "", newUrl + location.search + location.hash);
	        }
	    },
	    activate (event, ui) {
	        stateLoad = false;
	        let id = ui.newPanel.attr('id').replace('#', '');
	        if (id in self.modules) {
	            self.modules.fetch(id);
	        }
	    }
	});
	
	window.onpopstate = function (e) {
	    if (e.state && e.state.id) {
	        stateLoad = true;
	        $('#gladiator').tabs()
	        $(`a[href="${e.state.id}"]`).trigger('click');
	    }
	};
	
	let path = window.location.pathname;
	
	self.share.eventLoop.when(() => (
	        window.location.pathname !== path &&
	        window.location.pathname.substring(1,10) === "gladiator"
	    ), () => {
	    path = window.location.pathname;
	    let id = path.replace('/gladiator-', '');
	    if (!$(`#${id}`).is(':visible')) {
	        $(`#gladiator a[href="#${id}"]`).trigger('click');
	    }
	});
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.display.style="#gladiator.ui-tabs { font-size: 15.3px; }";
window.modules.navigation.prototype.modules.gladiator.prototype.display.view=$("<div id=\"gladiator\"> <ul> <li title=\"Tell Me About This Prospect.\"><a href=\"#culture\"> <i class=\"fas fa-flag\"></i> Culture </a></li> <li title=\"Here's What We Know About This Fighter.\"><a href=\"#biometrics\"> <i class=\"fas fa-diagnoses\"></i> Biometrics </a></li> <li title=\"Tell Me This Gladiator's Strengths.\"><a href=\"#attributes\"> <i class=\"fas fa-star-half-alt\"></i> Attributes </a></li> <li title=\"Spend Points; Get Good.\"><a href=\"#skills\"> <i class=\"fas fa-chess\"></i> Skills </a></li> <li title=\"We Hope You'll be Pleased With This Gladiator's Competitive Analysis.\"><a href=\"#combatStats\"> <i class=\"fas fa-fist-raised\"></i> Combat Stats </a></li> <li title=\"(Not Yet Implemented) &nbsp; &nbsp; &nbsp; &nbsp; Get Ready.\"><a href=\"#saveGladiator\"> <i class=\"fas fa-save\"></i> Save </a></li> </ul> <div id=\"saveGladiator\" class=\"item\" title=\"Nuu! ... R.I.P. Save\"> CAN HAZ SAVE!?!? </div> </div> ");
window.modules.navigation.prototype.modules.listGladiators = function () {
        const self = this;
	
	if (!self.loaded) {
	}
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules = {
        share: __SHARE__,
        fetch: function (name) {
            let m = new this[name];
            this[name].prototype.loaded = true;
            return m;
        }
    };
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes = function () {
        const self = this;
	
	if (!self.loaded) {
	    new self.hook.comms();
	    new self.control.events();
	}
	
    };
    
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.parent = window.modules.navigation.prototype.modules.gladiator.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.control.events=function() {
        const self = this;
	const eventLoop = self.share.eventLoop;
	const attributes = self.state.attributes;
	const modifiers = self.state.modifiers;
	let cultureSettings;
	
	function updateSliders() {
	    Object.keys(attributes).forEach(prop => {
	        if (prop === "serverSettings") {
	            return;
	        }
	        $(`#attributes [name=${prop}]`).
	            slider('value', attributes[prop]).
	            children('.custom-handle').
	            text(attributes[prop]);
	    });
	}
	
	eventLoop.after(() => (
	        !cultureSettings &&
	        (cultureSettings = self.share.cultureSettings)
	    ), () => {
	        cultureSettings.bindInput('name', 
	            $('#attributes [name=name]')
	        );
	});
	
	$( "#attributes .slider" ).slider({
	    create: function() {
	        $(this).children('.custom-handle').text( $(this).slider("value"));
	    },
	    slide: function( event, ui ) {
	        let name = $(this).attr('name');
	        if (ui.value > attributes[name]) {
	            let diff = ui.value - attributes[name];
	            if ((attributes.abilitySum + diff) > 91) {
	                return false;
	            }
	        }
	        
	        $(this).children('.custom-handle').text(ui.value);
	        
	    },
	    min: 3,
	    max: 18,
	    animate: 'slow'
	});
	$('#attributes [name=abilitySum]').
	    slider('option', 'max', 91).
	    slider('option', 'min', 21);
	
	$('#attributes .randomizeAttributes').on('click', e => {
	    let sum = attributes.abilitySum;
	    self.state.ignoreUpdate = true;
	    attributes.abilitySum = 21;
	    self.state.ignoreUpdate = false;
	    attributes.abilitySum = sum;
	    updateSliders();
	});
	
	$('#attributes ul>li .slider').each(function () {
	    let name = $(this).attr('name');
	
	    attributes.bindInput({
	        property: name,
	        element: $(this),
	        event: 'slidestop',
	        outHandler (element, value) {
	            element.
	                slider('value', value).
	                children('.custom-handle').
	                    text(value);
	        },
	        inHandler (element, proxy, prop) {
	            proxy[prop] = element.slider('value');
	            return updateSliders();
	        }
	    });
	});
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.control.modifiers=function() {
        const self = this;
	
	const modifiers = self.state.modifiers;
	$('#attributes ul>li .slider').each(function () {
	    let name = $(this).attr('name');
	    let fieldTooltip = "";
	    let slider = $(`#attributes [name=${name}`);
	    if (name in modifiers.final) {
	        slider.siblings('.final').text(modifiers.final[name]);
	    }
	
	    if (name in modifiers.age) {
	        if (modifiers.age[name] > 0) {
	            fieldTooltip += "+"
	        }
	        fieldTooltip += `${modifiers.age[name]} from age, `;
	    }
	
	    if (name in modifiers.bmi) {
	        if (modifiers.bmi[name] > 0) {
	            fieldTooltip += "+"
	        }
	        fieldTooltip += `${modifiers.bmi[name]} from BMI, `;
	    }
	
	    if (name in modifiers.sex) {
	        if (modifiers.sex[name] > 0) {
	            fieldTooltip += "+"
	        }
	        fieldTooltip += `${modifiers.sex[name]} from sex, `;
	    }
	
	    fieldTooltip = fieldTooltip.substr(0, fieldTooltip.length - 2);
	    if (fieldTooltip.length > 0) {
	        fieldTooltip += ".";
	    }
	    slider.parent('li').attr('title', fieldTooltip);
	});
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.control.modifiers.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.display.box=$("<div id=\"attributes\" class=\"item\"> <span> <img title=\"Don't have time for this? Generate random Attributes.\" src=\"/img/dice.png\" class=\"randomizeAttributes dice\"> Attributes For <input name=\"name\" value=\"Name Your Gladiator\"> </span> <ul class=\"gladiatorData\"> <li> <span class=\"label\">strength</span> <div class=\"slider\" name=\"strength\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">dexterity</span> <div class=\"slider\" name=\"dexterity\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">perception</span> <div class=\"slider\" name=\"perception\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">endurance</span> <div class=\"slider\" name=\"endurance\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">intelligence</span> <div class=\"slider\" name=\"intelligence\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">willpower</span> <div class=\"slider\" name=\"willpower\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">vitality</span> <div class=\"slider\" name=\"vitality\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span>ability sum</span> <div class=\"slider\" name=\"abilitySum\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> </li> </ul> </div>");
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.display.style="#attributes div < button[name=\"attributesNext\"] { display: block; } #attributes button[name=\"attributesPrevious\"] { display: block; float: left; } #attributes ul>li>.label { flex: 7; } #attributes ul>li>.final { flex: 2; } #attributes .slider { width: 480px; margin: 11.75px 40px; } #attributes input[name=\"name\"] { width: 57%; } #attributes button[name=\"attributesNext\"] { display: block; float: right; }";
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.hook={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.hook.comms=function() {
        const self = this;
	
	const MAX_ABILITY_SUM = 91;
	const MAX_STAT_SIZE = 18;
	const MIN_STAT_SIZE = 3;
	
	const attributes = waject({
	    strength: MIN_STAT_SIZE,
	    dexterity: MIN_STAT_SIZE,
	    perception: MIN_STAT_SIZE,
	    endurance: MIN_STAT_SIZE,
	    intelligence: MIN_STAT_SIZE,
	    willpower: MIN_STAT_SIZE,
	    vitality: MIN_STAT_SIZE,
	    abilitySum: MIN_STAT_SIZE * 7,
	    serverSettings: {}
	});
	
	const updatable = self.share.utility.isServerUpdatable;
	self.state.ignoreUpdate = false;
	
	function randomProperty (obj, f = () => true) {
	    var keys = Object.keys(obj).filter(f);
	    return  keys[keys.length * Math.random() << 0];
	};
	attributes.on('set', 'abilitySum', (result) => {
	    let target = result.target;
	    let val = result.value;
	    let prop = result.key;
	
	    if (isNaN(val)) {
	        result.value = target[prop];
	        result.cycle = false;
	        return;
	    }
	    let attrPool = {};
	    Object.keys(target).forEach(prop => {
	        if (prop === "abilitySum" || 
	            prop === "serverSettings") {
	            return;
	        }
	        attrPool[prop] = target[prop];
	    });
	    if (val > target.abilitySum) {
	        if (val > MAX_ABILITY_SUM) {
	            val = MAX_ABILITY_SUM;
	        }
	        let diff = val - target.abilitySum;
	        while (diff > 0) {
	            let randProp = randomProperty(attrPool);
	            if (target[randProp] >= MAX_STAT_SIZE) {
	                delete attrPool[randProp];
	                continue;
	            }
	            target[randProp] += 1;
	            diff -= 1;
	        }
	        result.value = val;
	        return;
	    }
	    if (val < target.abilitySum) {
	        if (val < (MIN_STAT_SIZE * 7)) {
	            val = MIN_STAT_SIZE * 7;
	        }
	        let diff = target.abilitySum - val;
	        while (diff > 0) {
	            let randProp = randomProperty(attrPool);
	            if (target[randProp] <= MIN_STAT_SIZE) {
	                delete attrPool[randProp];
	                continue;
	            }
	            target[randProp] -= 1;
	            diff -= 1;
	        }
	        result.value = val;
	        return;
	    }
	});
	
	attributes.on('set', (result) => {
	    let target = result.target;
	    let val = result.value;
	    let prop = result.key;
	    if (prop === "serverSettings") {
	        return;
	    }
	
	    if (prop === "abilitySum") {
	        return;
	    }
	
	    if (isNaN(val)) {
	        result.value = target[prop];
	        result.cycle = false;
	        return;
	    }
	
	    if (val > target[prop]) {
	        if (val > MAX_STAT_SIZE) {
	            val = MAX_STAT_SIZE;
	        }
	        let diff = val - target[prop];
	        if ((target.abilitySum + diff) > MAX_ABILITY_SUM) {
	            diff -= (target.abilitySum + diff) - MAX_ABILITY_SUM;
	        }
	        result.value = target[prop] + diff;
	        target.abilitySum += diff;
	        return;
	    }
	
	    if (val < target[prop]) {
	        if (val < MIN_STAT_SIZE) {
	            val = MIN_STAT_SIZE;
	        }
	        let diff = target[prop] - val;
	        result.value = target[prop] - diff;
	        target.abilitySum -= diff;
	        return;
	    }
	});
	
	self.state.attributes = attributes;
	self.share.attributeSettings = attributes;
	self.state.modifiers = {
	    age: {},
	    bmi: {},
	    sex: {},
	    final: {}
	};
	
	attributes.on('set', (result) => {
	    if (self.state.ignoreUpdate || 
	        !updatable(result)) {
	        return;
	    }
	    self.state.ignoreUpdate = true;
	    let update = {};
	    Object.keys(attributes).forEach(prop => {
	        if (prop === "serverSettings") {
	            return;
	        }
	        if (prop === result.key) {
	            update[prop] = result.value;
	            return;
	        }
	        update[prop] = attributes[prop];
	    });
	    attributes.serverSettings = update;
	    socket.emit("gladiator-attributes-change", update);
	    self.state.ignoreUpdate = false;
	});
	
	socket.on("gladiator-attributes", data => {
	    let serverSettings = {};
	    let same = true;
	    for (prop in data) {
	        if (prop === "abilitySum" ||
	            prop === "modifiers") {
	            continue;
	        }
	        serverSettings[prop] = data[prop];
	        if (data[prop] !== attributes[prop]) {
	            attributes[prop] = data[prop];
	            same = false;
	        }
	    }
	    if (!same) {
	        attributes.abilitySum = attributes.abilitySum;
	        serverSettings.abilitySum = attributes.abilitySum;
	        attributes.serverSettings = serverSettings;
	    }
	
	    self.state.modifiers.age = data.modifiers.age;
	    self.state.modifiers.bmi = data.modifiers.bmi;
	    self.state.modifiers.sex = data.modifiers.sex;
	    self.state.modifiers.final = data.modifiers.final;
	    new self.control.modifiers;
	});
	
	socket.emit("gladiator-attributes-ready");
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics = function () {
        const self = this;
	
	if (!self.loaded) {
	    new self.hook.comms();
	    new self.control.events();
	}
	
    };
    
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.parent = window.modules.navigation.prototype.modules.gladiator.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.control.events=function() {
        const self = this;
	const biometrics = self.state.biometrics;
	const eventLoop = self.share.eventLoop;
	let cultureSettings;
	$('#biometrics select').selectric();
	
	eventLoop.after(() => (
	        !cultureSettings &&
	        (cultureSettings = self.share.cultureSettings)
	    ), () => {
	        cultureSettings.bindInput('name', 
	            $('#biometrics [name=name]')
	        );
	        cultureSettings.bindInput({
	            property: 'culture',
	            element: $('#biometrics [name=culture]'),
	            outHandler: (element, val) => 
	                $(element).val(val).selectric()
	        });
	        cultureSettings.bindInput({
	            property: 'sex',
	            element: $('#biometrics [name=sex]'),
	            outHandler: (element, val) => 
	                $(element).val(val).selectric()
	        });
	});
	
	$('#biometrics ul>li input').each(function () {
	    biometrics.bindInput(this.name, this);
	});
	
	$('#biometrics').on(
	    'click', 
	    '.randomizeBiometrics', 
	    self.state.requestBiometrics
	);
	
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.display.box=$("<div id=\"biometrics\" class=\"item\"> <span> <img title=\"Don't Like These? Generate new Biometrics. This will not overwrite culture, sex, rank or name.\" src=\"/img/dice.png\" class=\"randomizeBiometrics dice\"> Biometrics For <input name=\"name\" value=\"Name Your Gladiator\"> </span> <ul class=\"gladiatorData\"> <li> <span>Culture</span> <select class=\"stat\" name=\"culture\"> <option>roman</option> <option>gallic</option> <option>germanic</option> <option>syrian</option> <option>numidian</option> <option>thracian</option> <option>greek</option> <option>iberian</option> <option>judean</option> <option>scythian</option> </select> </li> <li> <span>Sex</span> <select class=\"stat\" name=\"sex\"> <option>male</option> <option>female</option> </select> </li> <li> <span>Rank</span> <input type=\"number\" class=\"stat\" name=\"rank\" min=1 max=15> </li> <li> <span>Age</span> <input type=\"number\" class=\"stat\" name=\"age\" readonly> </li> <li> <span>Weight</span> <input type=\"number\" class=\"stat\" name=\"weight\" readonly> </li> <li> <span>Height</span> <input type=\"number\" class=\"stat\" name=\"height\" readonly> </li> <li> <span>BMI</span> <input type=\"number\" class=\"stat\" name=\"bmi\" readonly> </li> <li> <span>Reach</span> <input type=\"number\" class=\"stat\" name=\"reach\" readonly> </li> </ul> </div>");
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.display.style="div < button[name=\"biometricsNext\"] { display: block; } button[name=\"biometricsPrevious\"] { display: block; float: left; } #biometrics input[name=\"name\"] { width: 50%; } #biometrics select { width: 150px; } button[name=\"biometricsNext\"] { display: block; float: right; }";
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.hook={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.hook.comms=function() {
        const self = this;
	
	const biometrics = waject({
	    culture: 0,
	    sex: 0,
	    rank: 0,
	    age: 0,
	    weight: 0,
	    height: 0,
	    bmi: 0,
	    reach: 0
	});
	
	let serverRank;
	
	const biometricLabels = Object.keys(biometrics);
	biometricLabels.splice(biometricLabels.indexOf("serverSettings"), 1);
	
	self.share.biometricSettings = biometrics;
	self.state.biometrics = biometrics;
	
	self.state.requestBiometrics = function () {
	    console.log("requesting biometrics..");
	    socket.emit("gladiator-biometrics-generate");
	}
	
	biometrics.on('set', 'rank', (target, prop, val) => {
	    if (serverRank === undefined) {
	        return;
	    }
	    val = parseInt(val);
	    if (val < 1 || val > 15 || isNaN(val)) {
	        requestAnimationFrame(() => (biometrics.rank = serverRank));
	        return false;
	    }
	    target[prop] = val;
	    if (serverRank === val) {
	        return;
	    }
	    serverRank = val;
	    socket.emit('gladiator-biometrics-rank', val);
	});
	
	socket.on("gladiator-biometrics", data => {
	    biometrics['*'] = data;
	    serverRank = data.rank;
	});
	
	socket.emit("gladiator-biometrics-ready");
	
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats = function () {
        const self = this;
	
	if (!self.loaded) {
	    //new self.hook.comms();
	    //new self.control.events();
	} else {
	    //socket.emit("gladiator-combatStats-generate");
	}
    };
    
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.parent = window.modules.navigation.prototype.modules.gladiator.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.control.events=function() {
        const self = this;
	
	$('#combatStats [name=name]').val(self.share.name);
	
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.display.box=$("<div id=\"combatStats\" class=\"item\"> <span> Combat Statistics For <input name=\"name\" value=\"Name Your Gladiator\"> </span> <ul class=\"gladiatorData\"> <li title=\"Affected by endurance, lifestyle, rank, vitality, weight, and willpower.\"> <span>Health</span> <input type=\"number\" class=\"stat\" name=\"health\" readonly> </li> <li title=\"Affected by endurance, lifestyle, rank, vitality, willpower.\"> <span>Stamina</span> <input type=\"number\" class=\"stat\" name=\"stamina\" readonly> </li> <li> <span>Stamina Recovery</span> <input type=\"number\" class=\"stat\" name=\"staminaRecovery\" readonly> </li> <li> <span>Initiative</span> <input type=\"number\" class=\"stat\" name=\"initiative\" readonly> </li> <li> <span>Nerve</span> <input type=\"number\" class=\"stat\" name=\"nerve\" readonly> </li> <li> <span>Offense</span> <input type=\"number\" class=\"stat\" name=\"offense\" readonly> </li> <li> <span>Defense</span> <input type=\"number\" class=\"stat\" name=\"defense\" readonly> </li> <li> <span>Dodge</span> <input type=\"number\" class=\"stat\" name=\"dodge\" readonly> </li> <li> <span>Parry</span> <input type=\"number\" class=\"stat\" name=\"parry\" readonly> </li> </ul> </div>");
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.display.style="div < button[name=\"combatStatsNext\"] { display: block; } button[name=\"combatStatsPrevious\"] { display: block; float: left; } #combatStats input[name=\"name\"] { width: 50%; } #combatStats select { width: 150px; } button[name=\"combatStatsNext\"] { display: block; float: right; }";
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.hook={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.hook.comms=function() {
        const self = this;
	
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
	    combatStatsLabels.forEach(name => {
	        if (name in data) {
	            let val = data[name];
	            if (/\./.test("" + val)) {
	                val = val.toFixed(2);
	            }
	            $(`[name="${name}"]`).val(val);
	        }
	    });
	});
	
	socket.emit("gladiator-combatStats-ready");
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture = function () {
        const self = this;
	if (!self.loaded) {
	    new self.hook.comms();
	    new self.control.events();
	}
    };
    
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.parent = window.modules.navigation.prototype.modules.gladiator.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.control.events=function() {
        const self = this;
	
	const settings = self.state.settings;
	
	function getRandomInt(min, max) {
	    min = Math.ceil(min);
	    max = Math.floor(max);
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	function generateName () {
	    if (!settings.culture || !settings.sex) {
	        return;
	    }
	    let ref = self.state.names[settings.culture]
	    if (ref) {
	        ref = ref[settings.sex];
	    }
	    if (!ref) {
	        return;
	    }
	    let randName = ref[Math.floor(Math.random()*ref.length)];
	    settings.name = randName;
	};
	
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
	
	settings.bindInput('name', 
	    $('#culture [name=name]')
	);
	settings.bindInput({
	    property: 'culture',
	    element: $('#culture [name=culture]'),
	    outHandler: (element, val) => 
	        $(element).val(val).selectric()
	});
	settings.bindInput({
	    property: 'sex',
	    element: $('#culture [name=sex]'),
	    outHandler: (element, val) => 
	        $(element).val(val).selectric()
	});
	
	$('#culture select').selectric();
	
	$('#culture').on('click', '.randomizeName', e => {
	    generateName();
	});
	$('#culture').on('click', '.randomizeCulture', e => {
	    let randCulture = getRandomInt(0, 9);
	    let randSex = getRandomInt(0, 1);
	    settings.culture = cultures[randCulture];
	    settings.sex = sexes[randSex];
	    generateName();
	});
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.display.box=$("<div id=\"culture\" class=\"item\"> <span> <img title=\"Randomly Generate Culture, Sex and Name.\" src=\"/img/dice.png\" class=\"randomizeCulture dice\"> Culture of <input name=\"name\" placeholder=\"Name This Fighter\"> </span> <ul class=\"gladiatorData\"> <li> <span>Culture</span> <select class=\"stat\" name=\"culture\"> <option>roman</option> <option>gallic</option> <option>germanic</option> <option>syrian</option> <option>numidian</option> <option>thracian</option> <option>greek</option> <option>iberian</option> <option>judean</option> <option>scythian</option> </select> </li> <li> <span>Sex</span> <select class=\"stat\" name=\"sex\"> <option>male</option> <option>female</option> </select> </li> <li> <span> Name <img title=\"Randomly Generate a name based on The Fighter's Culture and Sex.\" src=\"/img/dice.png\" class=\"randomizeName dice\"> </span> <input class=\"stat\" name=\"name\"> </li> </ul> </div>");
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.display.style="div < button[name=\"cultureNext\"] { display: block; } #culture input[name=\"name\"] { width: 450px; } button[name=\"cultureNext\"] { display: block; float:right; } ";
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.hook={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.hook.comms=function() {
        const self = this;
	
	let updatable = self.share.utility.isServerUpdatable;
	
	self.state.settings = waject({
	    name: '',
	    culture: '',
	    sex: '',
	    serverSettings: {}
	});
	let settings = self.state.settings;
	self.share.cultureSettings = settings;
	
	self.state.names = {};
	
	function updateServer(result) {
	    let target = result.target;
	    target[result.key] = result.value;
	    for (setting in target.serverSettings) {
	        val = target.serverSettings[setting];
	        if (val !== target[setting]) {
	            target.serverSettings[setting] = target[setting];
	            socket.emit(`gladiator-${setting}`, target[setting]);
	        }
	    }
	}
	
	settings.on('set', (result) => {
	    if (!updatable(result)) {
	        return;
	    }
	    updateServer(result);
	});
	
	socket.emit("gladiator-culture-ready");
	
	socket.on("gladiator-names", d => {
	    self.state.names = d;
	});
	socket.on("gladiator-culture-info", d => {
	    self.state.cultureInfo = d;
	});
	socket.on("gladiator-name", d => {
	    settings.serverSettings.name = d;
	    settings.name = d;
	});
	socket.on("gladiator-sex", d => {
	    settings.serverSettings.sex = d;
	    settings.sex = d;
	});
	socket.on("gladiator-culture", d => {
	    settings.serverSettings.culture = d;
	    settings.culture = d;
	});
	
	
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills = function () {
        const self = this;
	
	if (!self.loaded) {
	    //new self.hook.comms();
	    //new self.control.events();
	} else {
	    //self.state.regenerateSkills();
	}
	
    };
    
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.parent = window.modules.navigation.prototype.modules.gladiator.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.control.events=function() {
        const self = this;
	
	socket.on('gladiator-rank', data => {
	    let rank = data;
	    let rankMax = rank * 2;
	    for (let label in self.share.skillMaxes) {
	        let skillMax = self.share.skillMaxes[label];
	        let max = (rankMax < skillMax) ? rankMax : skillMax;
	        $(`#skills .slider-container:has(.slider[name=${label}])`).
	                attr('title', `Maximum of ${max} for rank ${rank}`);
	    }
	});
	
	$( "#skills .slider" ).slider({
	    create: function() {
	        let name = $(this).attr('name');
	        let max = self.share.skillMaxes[name];
	        let rank = self.share.biometrics.rank || 1;
	        let rankMax = rank * 2;
	        $('#skills .slider-container').attr('title', `Maximum of ${rankMax} for rank ${rank}`);
	        $(this).slider('option', 'max', max);
	        $(this).children('.custom-handle').text( $(this).slider("value"));
	    },
	    slide: function( event, ui ) {
	        
	        let name = $(this).attr('name');
	        let max = $(this).slider('option', 'max');
	        let highestPoint = self.state.skillPoints + $(this).slider('value');
	        let rank = self.share.biometrics.rank || 1;
	        let rankMax = rank * 2;
	        let skillCeiling = rankMax;
	        if (skillCeiling < highestPoint) {
	            highestPoint = skillCeiling;
	        }
	        if (max < highestPoint) {
	            highestPoint = max;
	        }
	        
	        if (ui.value > highestPoint) {
	            ui.value = highestPoint;
	        }
	        $(this).children('.custom-handle').text(ui.value);
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
	        if (ui.value !== self.state.skills[name]) {
	            $(this).slider('option', 'value', self.state.skills[name]);
	        }
	    },
	    min: 0,
	    max: 16,
	    animate: 'slow'
	});
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.display.box=$("<div id=\"skills\" class=\"item\"> <span> Skills For <input name=\"name\" value=\"Name Your Gladiator\"> </span> <div> <span>Skill Points:</span> <span name=\"skillPoints\">10</span> </div> <ul class=\"gladiatorData\"> <li> <span>tactics</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"tactics\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\">n</span> <span class=\"description\">Abyssmal</span> </li> <li> <span>dodge</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"dodge\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>parry</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"parry\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>shield</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"shield\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>bash</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"bash\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>charge</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"charge\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>spear</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"spear\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>light Blade</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"lightBlade\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>heavy Blade</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"heavyBlade\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>bludgeoning</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"bludgeoning\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>axe</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"axe\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>riposte</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"riposte\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>close Combat</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"closeCombat\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>feint</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"feint\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>dirty Trick</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"dirtyTrick\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>appraise</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"appraise\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> </ul> </div>");
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.display.style="#skills div < button[name=\"skillsNext\"] { display: block; } #skills button[name=\"skillsPrevious\"] { display: block; float: left; } #skills .slider { width: 200px; margin: 11.75px 40px; } #skills input[name=\"name\"] { width: 57%; } #skills button[name=\"skillsNext\"] { display: block; float: right; color: rgba(255,255,255,0.72); } #skills .proficiency { text-align: center; } #skills .slider-container { color: rgba(170, 130, 25, 0.5); background: rgba(0, 0, 0, 0.32); border: 1px solid rgba(0,0,0,0.72); padding-left: 5px; padding-right: 5px; display: flex; flex-direction: row; width: 350px; } #skills .min { text-align: right; } #skills .max { text-align: left; } #skills .max, #skills .min { flex-grow: 0; padding-top: 8px; } #skills ul.gladiatorData>li>span:nth-child(1) { flex-grow: 3; }";
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.hook={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.hook.comms=function() {
        const self = this;
	let skillCeiling = 16;
	let totalSkillPoints = 0;
	
	function calcTactics (val) {
	    let input = {
	        intelligence: self.share.attributes.intelligence,
	        rank: self.share.biometrics.rank,
	        tacticspoints: val
	    };
	    let generator = {
	        input: input,
	        value: "0.1*(input.intelligence+input.rank/10*20)/2*input.tacticspoints"
	    };
	
	    return jsonSL(generator)
	}
	
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
	    value: self.share.biometrics.rank * 2,
	});
	
	self.state.regenerateSkills = function () {
	    for (let label in skills) {
	        let val = self.state.skills[label];
	        if (label === "tactics") {
	            $(`#skills .slider-container:has([name=${label}])`).
	                siblings('.proficiency').text(calcTactics(val).toFixed(2));
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
	    let input;
	    let attr = self.share.attributes;
	    let biometrics = self.share.biometrics;
	    if (!attr || !biometrics) {
	        input = {
	            "skill": skill,
	            "skillpointsspent": val,
	            "skillvalue": 0,
	            "dexterity": 10,
	            "endurance": 10,
	            "perception": 10,
	            "strength": 10,
	            "vitality": 10,
	            "willpower": 10,
	            "intelligence": 10,
	            "rank": 1,
	            "tacticspoints": 0
	        };
	    } else {
	        input = {
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
	        };
	    }
	    let generator = {
	        "input": input,
	
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
	    "tactics": 10,
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
	    if (label === "tactics") {
	        skillMaxes.tactics = 10;
	    }
	    if (skillMaxes[label] === undefined) {
	        skillMaxes[label] = 16;
	    }
	    //console.log("skillmax:", label, skillMaxes[label], result.skillmax);
	    $(`#skills .slider[name=${label}]`).
	        children('.custom-handle').text(skills[label]);
	
	    $(`#skills .slider-container:has([name=${label}])>.max`).
	        text(skillMaxes[label]);
	
	    self.state.skills.mk({
	        property: label,
	        value: 0,
	        preset: (o, name, val) => {
	            
	            if (o[name] === val) {
	                //console.log("ignoring update:", name, o[name], val);
	                return;
	            }
	            //console.log('skill change:', name, o[name], val);
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
	            //console.log('skill points:', skillPoints);
	            if (skillPoints < 0 && val > o[name]) {
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
	                let tacticsVal = calcTactics(val);
	                //console.log('tac val:', tacticsVal);
	                $(`#skills .slider-container:has([name=${name}])`).
	                    siblings('.proficiency').text(tacticsVal.toFixed(2));
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
	    //console.log("skills:",data);
	    totalSkillPoints = data.skillPoints;
	    self.state.skillPoints = data.skillPoints;
	    let t = 120;
	    for (let label in skills) {
	        if (label in data) {
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
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype;

    window.modules.navigation.prototype.modules.listGladiators.prototype.parent = window.modules.navigation.prototype;
    window.modules.navigation.prototype.modules.listGladiators.prototype.state = {};
    window.modules.navigation.prototype.modules.listGladiators.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.listGladiators.prototype.loaded = false;
    window.modules.navigation.prototype.modules.listGladiators.prototype.display={};
window.modules.navigation.prototype.modules.listGladiators.prototype.display.view=$("");
window.modules.navigation.prototype.modules.listGladiators.prototype.hook={};
window.modules.navigation.prototype.modules.listGladiators.prototype.hook.comms=function() {
        
    };
    window.modules.navigation.prototype.modules.listGladiators.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.listGladiators.prototype;
window.modules.navigation.prototype.modules.settings = function () {
        const self = this;
	
	if (!self.loaded) {
	    $('head').append("<style>" + self.display.style + "</style>");
	    $('#game').append(self.display.view);
	    self.state.dialog = $('#user-settings-dialog');
	    new self.hook.comms();
	    new self.control.sliders();
	    new self.control.dialog();
	    new self.control.sounds();
	}
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules = {
        share: __SHARE__,
        fetch: function (name) {
            let m = new this[name];
            this[name].prototype.loaded = true;
            return m;
        }
    };
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes = function () {
        const self = this;
	
	if (!self.loaded) {
	    new self.hook.comms();
	    new self.control.events();
	}
	
    };
    
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.parent = window.modules.navigation.prototype.modules.gladiator.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.control.events=function() {
        const self = this;
	const eventLoop = self.share.eventLoop;
	const attributes = self.state.attributes;
	const modifiers = self.state.modifiers;
	let cultureSettings;
	
	function updateSliders() {
	    Object.keys(attributes).forEach(prop => {
	        if (prop === "serverSettings") {
	            return;
	        }
	        $(`#attributes [name=${prop}]`).
	            slider('value', attributes[prop]).
	            children('.custom-handle').
	            text(attributes[prop]);
	    });
	}
	
	eventLoop.after(() => (
	        !cultureSettings &&
	        (cultureSettings = self.share.cultureSettings)
	    ), () => {
	        cultureSettings.bindInput('name', 
	            $('#attributes [name=name]')
	        );
	});
	
	$( "#attributes .slider" ).slider({
	    create: function() {
	        $(this).children('.custom-handle').text( $(this).slider("value"));
	    },
	    slide: function( event, ui ) {
	        let name = $(this).attr('name');
	        if (ui.value > attributes[name]) {
	            let diff = ui.value - attributes[name];
	            if ((attributes.abilitySum + diff) > 91) {
	                return false;
	            }
	        }
	        
	        $(this).children('.custom-handle').text(ui.value);
	        
	    },
	    min: 3,
	    max: 18,
	    animate: 'slow'
	});
	$('#attributes [name=abilitySum]').
	    slider('option', 'max', 91).
	    slider('option', 'min', 21);
	
	$('#attributes .randomizeAttributes').on('click', e => {
	    let sum = attributes.abilitySum;
	    self.state.ignoreUpdate = true;
	    attributes.abilitySum = 21;
	    self.state.ignoreUpdate = false;
	    attributes.abilitySum = sum;
	    updateSliders();
	});
	
	$('#attributes ul>li .slider').each(function () {
	    let name = $(this).attr('name');
	
	    attributes.bindInput({
	        property: name,
	        element: $(this),
	        event: 'slidestop',
	        outHandler (element, value) {
	            element.
	                slider('value', value).
	                children('.custom-handle').
	                    text(value);
	        },
	        inHandler (element, proxy, prop) {
	            proxy[prop] = element.slider('value');
	            return updateSliders();
	        }
	    });
	});
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.control.modifiers=function() {
        const self = this;
	
	const modifiers = self.state.modifiers;
	$('#attributes ul>li .slider').each(function () {
	    let name = $(this).attr('name');
	    let fieldTooltip = "";
	    let slider = $(`#attributes [name=${name}`);
	    if (name in modifiers.final) {
	        slider.siblings('.final').text(modifiers.final[name]);
	    }
	
	    if (name in modifiers.age) {
	        if (modifiers.age[name] > 0) {
	            fieldTooltip += "+"
	        }
	        fieldTooltip += `${modifiers.age[name]} from age, `;
	    }
	
	    if (name in modifiers.bmi) {
	        if (modifiers.bmi[name] > 0) {
	            fieldTooltip += "+"
	        }
	        fieldTooltip += `${modifiers.bmi[name]} from BMI, `;
	    }
	
	    if (name in modifiers.sex) {
	        if (modifiers.sex[name] > 0) {
	            fieldTooltip += "+"
	        }
	        fieldTooltip += `${modifiers.sex[name]} from sex, `;
	    }
	
	    fieldTooltip = fieldTooltip.substr(0, fieldTooltip.length - 2);
	    if (fieldTooltip.length > 0) {
	        fieldTooltip += ".";
	    }
	    slider.parent('li').attr('title', fieldTooltip);
	});
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.control.modifiers.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.display.box=$("<div id=\"attributes\" class=\"item\"> <span> <img title=\"Don't have time for this? Generate random Attributes.\" src=\"/img/dice.png\" class=\"randomizeAttributes dice\"> Attributes For <input name=\"name\" value=\"Name Your Gladiator\"> </span> <ul class=\"gladiatorData\"> <li> <span class=\"label\">strength</span> <div class=\"slider\" name=\"strength\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">dexterity</span> <div class=\"slider\" name=\"dexterity\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">perception</span> <div class=\"slider\" name=\"perception\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">endurance</span> <div class=\"slider\" name=\"endurance\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">intelligence</span> <div class=\"slider\" name=\"intelligence\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">willpower</span> <div class=\"slider\" name=\"willpower\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span class=\"label\">vitality</span> <div class=\"slider\" name=\"vitality\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"final\"> 0 </span> </li> <li> <span>ability sum</span> <div class=\"slider\" name=\"abilitySum\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> </li> </ul> </div>");
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.display.style="#attributes div < button[name=\"attributesNext\"] { display: block; } #attributes button[name=\"attributesPrevious\"] { display: block; float: left; } #attributes ul>li>.label { flex: 7; } #attributes ul>li>.final { flex: 2; } #attributes .slider { width: 480px; margin: 11.75px 40px; } #attributes input[name=\"name\"] { width: 57%; } #attributes button[name=\"attributesNext\"] { display: block; float: right; }";
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.hook={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.hook.comms=function() {
        const self = this;
	
	const MAX_ABILITY_SUM = 91;
	const MAX_STAT_SIZE = 18;
	const MIN_STAT_SIZE = 3;
	
	const attributes = waject({
	    strength: MIN_STAT_SIZE,
	    dexterity: MIN_STAT_SIZE,
	    perception: MIN_STAT_SIZE,
	    endurance: MIN_STAT_SIZE,
	    intelligence: MIN_STAT_SIZE,
	    willpower: MIN_STAT_SIZE,
	    vitality: MIN_STAT_SIZE,
	    abilitySum: MIN_STAT_SIZE * 7,
	    serverSettings: {}
	});
	
	const updatable = self.share.utility.isServerUpdatable;
	self.state.ignoreUpdate = false;
	
	function randomProperty (obj, f = () => true) {
	    var keys = Object.keys(obj).filter(f);
	    return  keys[keys.length * Math.random() << 0];
	};
	attributes.on('set', 'abilitySum', (result) => {
	    let target = result.target;
	    let val = result.value;
	    let prop = result.key;
	
	    if (isNaN(val)) {
	        result.value = target[prop];
	        result.cycle = false;
	        return;
	    }
	    let attrPool = {};
	    Object.keys(target).forEach(prop => {
	        if (prop === "abilitySum" || 
	            prop === "serverSettings") {
	            return;
	        }
	        attrPool[prop] = target[prop];
	    });
	    if (val > target.abilitySum) {
	        if (val > MAX_ABILITY_SUM) {
	            val = MAX_ABILITY_SUM;
	        }
	        let diff = val - target.abilitySum;
	        while (diff > 0) {
	            let randProp = randomProperty(attrPool);
	            if (target[randProp] >= MAX_STAT_SIZE) {
	                delete attrPool[randProp];
	                continue;
	            }
	            target[randProp] += 1;
	            diff -= 1;
	        }
	        result.value = val;
	        return;
	    }
	    if (val < target.abilitySum) {
	        if (val < (MIN_STAT_SIZE * 7)) {
	            val = MIN_STAT_SIZE * 7;
	        }
	        let diff = target.abilitySum - val;
	        while (diff > 0) {
	            let randProp = randomProperty(attrPool);
	            if (target[randProp] <= MIN_STAT_SIZE) {
	                delete attrPool[randProp];
	                continue;
	            }
	            target[randProp] -= 1;
	            diff -= 1;
	        }
	        result.value = val;
	        return;
	    }
	});
	
	attributes.on('set', (result) => {
	    let target = result.target;
	    let val = result.value;
	    let prop = result.key;
	    if (prop === "serverSettings") {
	        return;
	    }
	
	    if (prop === "abilitySum") {
	        return;
	    }
	
	    if (isNaN(val)) {
	        result.value = target[prop];
	        result.cycle = false;
	        return;
	    }
	
	    if (val > target[prop]) {
	        if (val > MAX_STAT_SIZE) {
	            val = MAX_STAT_SIZE;
	        }
	        let diff = val - target[prop];
	        if ((target.abilitySum + diff) > MAX_ABILITY_SUM) {
	            diff -= (target.abilitySum + diff) - MAX_ABILITY_SUM;
	        }
	        result.value = target[prop] + diff;
	        target.abilitySum += diff;
	        return;
	    }
	
	    if (val < target[prop]) {
	        if (val < MIN_STAT_SIZE) {
	            val = MIN_STAT_SIZE;
	        }
	        let diff = target[prop] - val;
	        result.value = target[prop] - diff;
	        target.abilitySum -= diff;
	        return;
	    }
	});
	
	self.state.attributes = attributes;
	self.share.attributeSettings = attributes;
	self.state.modifiers = {
	    age: {},
	    bmi: {},
	    sex: {},
	    final: {}
	};
	
	attributes.on('set', (result) => {
	    if (self.state.ignoreUpdate || 
	        !updatable(result)) {
	        return;
	    }
	    self.state.ignoreUpdate = true;
	    let update = {};
	    Object.keys(attributes).forEach(prop => {
	        if (prop === "serverSettings") {
	            return;
	        }
	        if (prop === result.key) {
	            update[prop] = result.value;
	            return;
	        }
	        update[prop] = attributes[prop];
	    });
	    attributes.serverSettings = update;
	    socket.emit("gladiator-attributes-change", update);
	    self.state.ignoreUpdate = false;
	});
	
	socket.on("gladiator-attributes", data => {
	    let serverSettings = {};
	    let same = true;
	    for (prop in data) {
	        if (prop === "abilitySum" ||
	            prop === "modifiers") {
	            continue;
	        }
	        serverSettings[prop] = data[prop];
	        if (data[prop] !== attributes[prop]) {
	            attributes[prop] = data[prop];
	            same = false;
	        }
	    }
	    if (!same) {
	        attributes.abilitySum = attributes.abilitySum;
	        serverSettings.abilitySum = attributes.abilitySum;
	        attributes.serverSettings = serverSettings;
	    }
	
	    self.state.modifiers.age = data.modifiers.age;
	    self.state.modifiers.bmi = data.modifiers.bmi;
	    self.state.modifiers.sex = data.modifiers.sex;
	    self.state.modifiers.final = data.modifiers.final;
	    new self.control.modifiers;
	});
	
	socket.emit("gladiator-attributes-ready");
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.attributes.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics = function () {
        const self = this;
	
	if (!self.loaded) {
	    new self.hook.comms();
	    new self.control.events();
	}
	
    };
    
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.parent = window.modules.navigation.prototype.modules.gladiator.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.control.events=function() {
        const self = this;
	const biometrics = self.state.biometrics;
	const eventLoop = self.share.eventLoop;
	let cultureSettings;
	$('#biometrics select').selectric();
	
	eventLoop.after(() => (
	        !cultureSettings &&
	        (cultureSettings = self.share.cultureSettings)
	    ), () => {
	        cultureSettings.bindInput('name', 
	            $('#biometrics [name=name]')
	        );
	        cultureSettings.bindInput({
	            property: 'culture',
	            element: $('#biometrics [name=culture]'),
	            outHandler: (element, val) => 
	                $(element).val(val).selectric()
	        });
	        cultureSettings.bindInput({
	            property: 'sex',
	            element: $('#biometrics [name=sex]'),
	            outHandler: (element, val) => 
	                $(element).val(val).selectric()
	        });
	});
	
	$('#biometrics ul>li input').each(function () {
	    biometrics.bindInput(this.name, this);
	});
	
	$('#biometrics').on(
	    'click', 
	    '.randomizeBiometrics', 
	    self.state.requestBiometrics
	);
	
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.display.box=$("<div id=\"biometrics\" class=\"item\"> <span> <img title=\"Don't Like These? Generate new Biometrics. This will not overwrite culture, sex, rank or name.\" src=\"/img/dice.png\" class=\"randomizeBiometrics dice\"> Biometrics For <input name=\"name\" value=\"Name Your Gladiator\"> </span> <ul class=\"gladiatorData\"> <li> <span>Culture</span> <select class=\"stat\" name=\"culture\"> <option>roman</option> <option>gallic</option> <option>germanic</option> <option>syrian</option> <option>numidian</option> <option>thracian</option> <option>greek</option> <option>iberian</option> <option>judean</option> <option>scythian</option> </select> </li> <li> <span>Sex</span> <select class=\"stat\" name=\"sex\"> <option>male</option> <option>female</option> </select> </li> <li> <span>Rank</span> <input type=\"number\" class=\"stat\" name=\"rank\" min=1 max=15> </li> <li> <span>Age</span> <input type=\"number\" class=\"stat\" name=\"age\" readonly> </li> <li> <span>Weight</span> <input type=\"number\" class=\"stat\" name=\"weight\" readonly> </li> <li> <span>Height</span> <input type=\"number\" class=\"stat\" name=\"height\" readonly> </li> <li> <span>BMI</span> <input type=\"number\" class=\"stat\" name=\"bmi\" readonly> </li> <li> <span>Reach</span> <input type=\"number\" class=\"stat\" name=\"reach\" readonly> </li> </ul> </div>");
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.display.style="div < button[name=\"biometricsNext\"] { display: block; } button[name=\"biometricsPrevious\"] { display: block; float: left; } #biometrics input[name=\"name\"] { width: 50%; } #biometrics select { width: 150px; } button[name=\"biometricsNext\"] { display: block; float: right; }";
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.hook={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.hook.comms=function() {
        const self = this;
	
	const biometrics = waject({
	    culture: 0,
	    sex: 0,
	    rank: 0,
	    age: 0,
	    weight: 0,
	    height: 0,
	    bmi: 0,
	    reach: 0
	});
	
	let serverRank;
	
	const biometricLabels = Object.keys(biometrics);
	biometricLabels.splice(biometricLabels.indexOf("serverSettings"), 1);
	
	self.share.biometricSettings = biometrics;
	self.state.biometrics = biometrics;
	
	self.state.requestBiometrics = function () {
	    console.log("requesting biometrics..");
	    socket.emit("gladiator-biometrics-generate");
	}
	
	biometrics.on('set', 'rank', (target, prop, val) => {
	    if (serverRank === undefined) {
	        return;
	    }
	    val = parseInt(val);
	    if (val < 1 || val > 15 || isNaN(val)) {
	        requestAnimationFrame(() => (biometrics.rank = serverRank));
	        return false;
	    }
	    target[prop] = val;
	    if (serverRank === val) {
	        return;
	    }
	    serverRank = val;
	    socket.emit('gladiator-biometrics-rank', val);
	});
	
	socket.on("gladiator-biometrics", data => {
	    biometrics['*'] = data;
	    serverRank = data.rank;
	});
	
	socket.emit("gladiator-biometrics-ready");
	
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.biometrics.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats = function () {
        const self = this;
	
	if (!self.loaded) {
	    //new self.hook.comms();
	    //new self.control.events();
	} else {
	    //socket.emit("gladiator-combatStats-generate");
	}
    };
    
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.parent = window.modules.navigation.prototype.modules.gladiator.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.control.events=function() {
        const self = this;
	
	$('#combatStats [name=name]').val(self.share.name);
	
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.display.box=$("<div id=\"combatStats\" class=\"item\"> <span> Combat Statistics For <input name=\"name\" value=\"Name Your Gladiator\"> </span> <ul class=\"gladiatorData\"> <li title=\"Affected by endurance, lifestyle, rank, vitality, weight, and willpower.\"> <span>Health</span> <input type=\"number\" class=\"stat\" name=\"health\" readonly> </li> <li title=\"Affected by endurance, lifestyle, rank, vitality, willpower.\"> <span>Stamina</span> <input type=\"number\" class=\"stat\" name=\"stamina\" readonly> </li> <li> <span>Stamina Recovery</span> <input type=\"number\" class=\"stat\" name=\"staminaRecovery\" readonly> </li> <li> <span>Initiative</span> <input type=\"number\" class=\"stat\" name=\"initiative\" readonly> </li> <li> <span>Nerve</span> <input type=\"number\" class=\"stat\" name=\"nerve\" readonly> </li> <li> <span>Offense</span> <input type=\"number\" class=\"stat\" name=\"offense\" readonly> </li> <li> <span>Defense</span> <input type=\"number\" class=\"stat\" name=\"defense\" readonly> </li> <li> <span>Dodge</span> <input type=\"number\" class=\"stat\" name=\"dodge\" readonly> </li> <li> <span>Parry</span> <input type=\"number\" class=\"stat\" name=\"parry\" readonly> </li> </ul> </div>");
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.display.style="div < button[name=\"combatStatsNext\"] { display: block; } button[name=\"combatStatsPrevious\"] { display: block; float: left; } #combatStats input[name=\"name\"] { width: 50%; } #combatStats select { width: 150px; } button[name=\"combatStatsNext\"] { display: block; float: right; }";
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.hook={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.hook.comms=function() {
        const self = this;
	
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
	    combatStatsLabels.forEach(name => {
	        if (name in data) {
	            let val = data[name];
	            if (/\./.test("" + val)) {
	                val = val.toFixed(2);
	            }
	            $(`[name="${name}"]`).val(val);
	        }
	    });
	});
	
	socket.emit("gladiator-combatStats-ready");
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.combatStats.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture = function () {
        const self = this;
	if (!self.loaded) {
	    new self.hook.comms();
	    new self.control.events();
	}
    };
    
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.parent = window.modules.navigation.prototype.modules.gladiator.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.control.events=function() {
        const self = this;
	
	const settings = self.state.settings;
	
	function getRandomInt(min, max) {
	    min = Math.ceil(min);
	    max = Math.floor(max);
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	function generateName () {
	    if (!settings.culture || !settings.sex) {
	        return;
	    }
	    let ref = self.state.names[settings.culture]
	    if (ref) {
	        ref = ref[settings.sex];
	    }
	    if (!ref) {
	        return;
	    }
	    let randName = ref[Math.floor(Math.random()*ref.length)];
	    settings.name = randName;
	};
	
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
	
	settings.bindInput('name', 
	    $('#culture [name=name]')
	);
	settings.bindInput({
	    property: 'culture',
	    element: $('#culture [name=culture]'),
	    outHandler: (element, val) => 
	        $(element).val(val).selectric()
	});
	settings.bindInput({
	    property: 'sex',
	    element: $('#culture [name=sex]'),
	    outHandler: (element, val) => 
	        $(element).val(val).selectric()
	});
	
	$('#culture select').selectric();
	
	$('#culture').on('click', '.randomizeName', e => {
	    generateName();
	});
	$('#culture').on('click', '.randomizeCulture', e => {
	    let randCulture = getRandomInt(0, 9);
	    let randSex = getRandomInt(0, 1);
	    settings.culture = cultures[randCulture];
	    settings.sex = sexes[randSex];
	    generateName();
	});
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.display.box=$("<div id=\"culture\" class=\"item\"> <span> <img title=\"Randomly Generate Culture, Sex and Name.\" src=\"/img/dice.png\" class=\"randomizeCulture dice\"> Culture of <input name=\"name\" placeholder=\"Name This Fighter\"> </span> <ul class=\"gladiatorData\"> <li> <span>Culture</span> <select class=\"stat\" name=\"culture\"> <option>roman</option> <option>gallic</option> <option>germanic</option> <option>syrian</option> <option>numidian</option> <option>thracian</option> <option>greek</option> <option>iberian</option> <option>judean</option> <option>scythian</option> </select> </li> <li> <span>Sex</span> <select class=\"stat\" name=\"sex\"> <option>male</option> <option>female</option> </select> </li> <li> <span> Name <img title=\"Randomly Generate a name based on The Fighter's Culture and Sex.\" src=\"/img/dice.png\" class=\"randomizeName dice\"> </span> <input class=\"stat\" name=\"name\"> </li> </ul> </div>");
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.display.style="div < button[name=\"cultureNext\"] { display: block; } #culture input[name=\"name\"] { width: 450px; } button[name=\"cultureNext\"] { display: block; float:right; } ";
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.hook={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.hook.comms=function() {
        const self = this;
	
	let updatable = self.share.utility.isServerUpdatable;
	
	self.state.settings = waject({
	    name: '',
	    culture: '',
	    sex: '',
	    serverSettings: {}
	});
	let settings = self.state.settings;
	self.share.cultureSettings = settings;
	
	self.state.names = {};
	
	function updateServer(result) {
	    let target = result.target;
	    target[result.key] = result.value;
	    for (setting in target.serverSettings) {
	        val = target.serverSettings[setting];
	        if (val !== target[setting]) {
	            target.serverSettings[setting] = target[setting];
	            socket.emit(`gladiator-${setting}`, target[setting]);
	        }
	    }
	}
	
	settings.on('set', (result) => {
	    if (!updatable(result)) {
	        return;
	    }
	    updateServer(result);
	});
	
	socket.emit("gladiator-culture-ready");
	
	socket.on("gladiator-names", d => {
	    self.state.names = d;
	});
	socket.on("gladiator-culture-info", d => {
	    self.state.cultureInfo = d;
	});
	socket.on("gladiator-name", d => {
	    settings.serverSettings.name = d;
	    settings.name = d;
	});
	socket.on("gladiator-sex", d => {
	    settings.serverSettings.sex = d;
	    settings.sex = d;
	});
	socket.on("gladiator-culture", d => {
	    settings.serverSettings.culture = d;
	    settings.culture = d;
	});
	
	
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.culture.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills = function () {
        const self = this;
	
	if (!self.loaded) {
	    //new self.hook.comms();
	    //new self.control.events();
	} else {
	    //self.state.regenerateSkills();
	}
	
    };
    
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.parent = window.modules.navigation.prototype.modules.gladiator.prototype;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.state = {};
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.loaded = false;
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.control={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.control.events=function() {
        const self = this;
	
	socket.on('gladiator-rank', data => {
	    let rank = data;
	    let rankMax = rank * 2;
	    for (let label in self.share.skillMaxes) {
	        let skillMax = self.share.skillMaxes[label];
	        let max = (rankMax < skillMax) ? rankMax : skillMax;
	        $(`#skills .slider-container:has(.slider[name=${label}])`).
	                attr('title', `Maximum of ${max} for rank ${rank}`);
	    }
	});
	
	$( "#skills .slider" ).slider({
	    create: function() {
	        let name = $(this).attr('name');
	        let max = self.share.skillMaxes[name];
	        let rank = self.share.biometrics.rank || 1;
	        let rankMax = rank * 2;
	        $('#skills .slider-container').attr('title', `Maximum of ${rankMax} for rank ${rank}`);
	        $(this).slider('option', 'max', max);
	        $(this).children('.custom-handle').text( $(this).slider("value"));
	    },
	    slide: function( event, ui ) {
	        
	        let name = $(this).attr('name');
	        let max = $(this).slider('option', 'max');
	        let highestPoint = self.state.skillPoints + $(this).slider('value');
	        let rank = self.share.biometrics.rank || 1;
	        let rankMax = rank * 2;
	        let skillCeiling = rankMax;
	        if (skillCeiling < highestPoint) {
	            highestPoint = skillCeiling;
	        }
	        if (max < highestPoint) {
	            highestPoint = max;
	        }
	        
	        if (ui.value > highestPoint) {
	            ui.value = highestPoint;
	        }
	        $(this).children('.custom-handle').text(ui.value);
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
	        if (ui.value !== self.state.skills[name]) {
	            $(this).slider('option', 'value', self.state.skills[name]);
	        }
	    },
	    min: 0,
	    max: 16,
	    animate: 'slow'
	});
    };
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.control.events.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype;
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.display={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.display.box=$("<div id=\"skills\" class=\"item\"> <span> Skills For <input name=\"name\" value=\"Name Your Gladiator\"> </span> <div> <span>Skill Points:</span> <span name=\"skillPoints\">10</span> </div> <ul class=\"gladiatorData\"> <li> <span>tactics</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"tactics\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\">n</span> <span class=\"description\">Abyssmal</span> </li> <li> <span>dodge</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"dodge\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>parry</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"parry\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>shield</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"shield\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>bash</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"bash\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>charge</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"charge\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>spear</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"spear\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>light Blade</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"lightBlade\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>heavy Blade</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"heavyBlade\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>bludgeoning</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"bludgeoning\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>axe</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"axe\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>riposte</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"riposte\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>close Combat</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"closeCombat\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>feint</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"feint\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>dirty Trick</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"dirtyTrick\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> <li> <span>appraise</span> <div class=\"slider-container\"> <span class=\"min\">0</span> <div class=\"slider\" name=\"appraise\"> <div class=\"ui-slider-handle custom-handle\"> </div> </div> <span class=\"max\">16</span> </div> <span class=\"proficiency\"></span> <span class=\"description\"></span> </li> </ul> </div>");
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.display.style="#skills div < button[name=\"skillsNext\"] { display: block; } #skills button[name=\"skillsPrevious\"] { display: block; float: left; } #skills .slider { width: 200px; margin: 11.75px 40px; } #skills input[name=\"name\"] { width: 57%; } #skills button[name=\"skillsNext\"] { display: block; float: right; color: rgba(255,255,255,0.72); } #skills .proficiency { text-align: center; } #skills .slider-container { color: rgba(170, 130, 25, 0.5); background: rgba(0, 0, 0, 0.32); border: 1px solid rgba(0,0,0,0.72); padding-left: 5px; padding-right: 5px; display: flex; flex-direction: row; width: 350px; } #skills .min { text-align: right; } #skills .max { text-align: left; } #skills .max, #skills .min { flex-grow: 0; padding-top: 8px; } #skills ul.gladiatorData>li>span:nth-child(1) { flex-grow: 3; }";
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.hook={};
window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.hook.comms=function() {
        const self = this;
	let skillCeiling = 16;
	let totalSkillPoints = 0;
	
	function calcTactics (val) {
	    let input = {
	        intelligence: self.share.attributes.intelligence,
	        rank: self.share.biometrics.rank,
	        tacticspoints: val
	    };
	    let generator = {
	        input: input,
	        value: "0.1*(input.intelligence+input.rank/10*20)/2*input.tacticspoints"
	    };
	
	    return jsonSL(generator)
	}
	
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
	    value: self.share.biometrics.rank * 2,
	});
	
	self.state.regenerateSkills = function () {
	    for (let label in skills) {
	        let val = self.state.skills[label];
	        if (label === "tactics") {
	            $(`#skills .slider-container:has([name=${label}])`).
	                siblings('.proficiency').text(calcTactics(val).toFixed(2));
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
	    let input;
	    let attr = self.share.attributes;
	    let biometrics = self.share.biometrics;
	    if (!attr || !biometrics) {
	        input = {
	            "skill": skill,
	            "skillpointsspent": val,
	            "skillvalue": 0,
	            "dexterity": 10,
	            "endurance": 10,
	            "perception": 10,
	            "strength": 10,
	            "vitality": 10,
	            "willpower": 10,
	            "intelligence": 10,
	            "rank": 1,
	            "tacticspoints": 0
	        };
	    } else {
	        input = {
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
	        };
	    }
	    let generator = {
	        "input": input,
	
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
	    "tactics": 10,
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
	    if (label === "tactics") {
	        skillMaxes.tactics = 10;
	    }
	    if (skillMaxes[label] === undefined) {
	        skillMaxes[label] = 16;
	    }
	    //console.log("skillmax:", label, skillMaxes[label], result.skillmax);
	    $(`#skills .slider[name=${label}]`).
	        children('.custom-handle').text(skills[label]);
	
	    $(`#skills .slider-container:has([name=${label}])>.max`).
	        text(skillMaxes[label]);
	
	    self.state.skills.mk({
	        property: label,
	        value: 0,
	        preset: (o, name, val) => {
	            
	            if (o[name] === val) {
	                //console.log("ignoring update:", name, o[name], val);
	                return;
	            }
	            //console.log('skill change:', name, o[name], val);
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
	            //console.log('skill points:', skillPoints);
	            if (skillPoints < 0 && val > o[name]) {
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
	                let tacticsVal = calcTactics(val);
	                //console.log('tac val:', tacticsVal);
	                $(`#skills .slider-container:has([name=${name}])`).
	                    siblings('.proficiency').text(tacticsVal.toFixed(2));
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
	    //console.log("skills:",data);
	    totalSkillPoints = data.skillPoints;
	    self.state.skillPoints = data.skillPoints;
	    let t = 120;
	    for (let label in skills) {
	        if (label in data) {
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
    window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.gladiator.prototype.modules.skills.prototype;

    window.modules.navigation.prototype.modules.settings.prototype.parent = window.modules.navigation.prototype;
    window.modules.navigation.prototype.modules.settings.prototype.state = {};
    window.modules.navigation.prototype.modules.settings.prototype.share = __SHARE__;
    window.modules.navigation.prototype.modules.settings.prototype.loaded = false;
    window.modules.navigation.prototype.modules.settings.prototype.control={};
window.modules.navigation.prototype.modules.settings.prototype.control.dialog=function() {
        const self = this;
	
	self.state.dialog.dialog({
	    autoOpen: false,
	    modal: true,
	    width: 720,
	    show: {
	        effect: 'puff',
	        duration: 250
	    }, 
	    hide: {
	        effect: 'puff',
	        duration: 250
	    },
	    beforeClose () {
	        delete self.share.query.soundSettings;
	    },
	    close () {
	        self.share.sounds.bow.play();
	    },
	    create () {
	        self.share.eventLoop.when(() => (
	                self.share.query.soundSettings === true &&
	                !$('#user-settings-dialog').dialog('isOpen')
	            ), () => {
	            $('#user-settings-dialog').dialog('open');
	        });
	    },
	    open () {
	        self.share.query.soundSettings = true;
	        self.share.sounds.switch.play();
	        $('.ui-widget-overlay').one('click', () => $(this).dialog('close'));
	    }
	});
    };
    window.modules.navigation.prototype.modules.settings.prototype.control.dialog.prototype = window.modules.navigation.prototype.modules.settings.prototype;
window.modules.navigation.prototype.modules.settings.prototype.control.sliders=function() {
        const self = this;
	const settings = self.state.settings;
	
	self.state.dialog.on('dialogcreate', () => {
	    $('#user-settings-dialog .slider[name=master-sound]').slider({
	        value: 0,
	        min: 0,
	        max: 1,
	        step: 1,
	        create () {
	            settings.on('set', 'masterSound', (target, prop, val) => {
	                $(this).
	                    slider('value', val).
	                    children('.custom-handle').text(val ? 'On' : 'Off');
	                return val;
	            });
	        },
	        slide (event, ui) {
	            settings.masterSound = ui.value;
	        },
	        animate: 'fast'
	    });
	
	    $('#user-settings-dialog .slider[name=master-volume]').slider({
	        value: 80,
	        min: 0,
	        max: 100,
	        step: 5,
	        create () {
	            settings.on('set', 'masterVolume', (target, prop, val) => {
	                $(this).slider('value', val);
	                return val;
	            });
	        },
	        slide (event, ui) {
	            settings.masterVolume = ui.value;
	        },
	        animate: 'fast'
	    });
	
	    $('#user-settings-dialog .slider[name=music-volume]').slider({
	        value: 80,
	        min: 0,
	        max: 100,
	        step: 5,
	        create () {
	            settings.on('set', 'musicVolume', (target, prop, val) => {
	                $(this).slider('value', val);
	                return val;
	            });
	        },
	        slide (event, ui) {
	            settings.musicVolume = ui.value;
	        },
	        animate: 'fast'
	    });
	
	    $('#user-settings-dialog .slider[name=fx-volume]').slider({
	        value: 80,
	        min: 0,
	        max: 100,
	        step: 5,
	        create: function() {
	            settings.on('set', 'fxVolume', (target, prop, val) => {
	                $(this).slider('value', val);
	                return val;
	            });
	        },
	        slide: function (event, ui) {
	            settings.fxVolume = ui.value;
	        },
	        animate: 'fast'
	    });
	});
    };
    window.modules.navigation.prototype.modules.settings.prototype.control.sliders.prototype = window.modules.navigation.prototype.modules.settings.prototype;
window.modules.navigation.prototype.modules.settings.prototype.control.sounds=function() {
        const self = this;
	
	$('body').on('click', '.user-settings-btn', function (e) {
	    self.state.dialog.dialog('open');
	});
	
	$('body').on('click', '.next,.previous,.ui-tab a', () => {
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
	})
	
	$('body').on('click', '.dice', () => {
	    function randomDie () {
	        return 1 + (3 * Math.random() << 0);
	    };
	    let r = randomDie();
	    let sound = self.share.sounds["dice" + r];
	    sound.play();
	});
    };
    window.modules.navigation.prototype.modules.settings.prototype.control.sounds.prototype = window.modules.navigation.prototype.modules.settings.prototype;
window.modules.navigation.prototype.modules.settings.prototype.display={};
window.modules.navigation.prototype.modules.settings.prototype.display.style=".user-settings-btn { width: 64px; height: 64px; padding: 0 0; margin: 0 0; display: block; position: absolute; right: 0px; top: 0px; background: rgba(255,255,255,0.5); border-radius: 64px; border: 1px outset rgb(255,255,255,0.5); cursor: pointer; } .user-settings-btn:hover { border: 1px outset rgb(255,255,255,1); } .user-settings-btn:active { border: 1px inset rgb(255,255,255,1); } #user-settings-dialog { width:420px; display: none; background: rgb(0,0,0,0.72); } #user-settings-dialog .note { font-size: 12px; color: #848484; font-family: arial; text-shadow: 0px 0px 0px rgba(255,255,255,0.72); } #user-settings-dialog [name=master-sound] { width: 60px; margin: 11.75px 40px; } #user-settings-dialog [name=master-volume], #user-settings-dialog [name=music-volume], #user-settings-dialog [name=fx-volume] { width: 360px; margin: 11.75px 40px; } #user-settings-dialog .slider .custom-handle { width: 3em; height: 1.6em; top: 50%; margin-top: -.8em; margin-left: -30px; text-align: center; line-height: 1.6em; } ul.userData { list-style: none; background-color: rgba(164, 148, 105, 0.36); margin: 50px 0; padding: 10px; border: 0.5px outset rgba(170, 130, 25, 0.32); border-radius: 3px; } ul.userData>li { display: flex; flex-direction: row; box-shadow: 2px 2px 5px rgba(0,0,0, 0.32); padding: 5px; margin: 5px; background: rgba(0, 0, 0, 0.32); } ul.userData>li>span { padding-top: 6px; flex: 2; }";
window.modules.navigation.prototype.modules.settings.prototype.display.view=$("<div id=\"user-settings-dialog\" title=\"Settings\"> <h2>Sound Settings</h2> <ul class=\"userData\"> <li> <span>Master Sound</span> <div class=\"slider\" name=\"master-sound\"> <div class=\"ui-slider-handle custom-handle\"> Off </div> </div> </li> <li> <span>Master Volume</span> <div class=\"slider\" name=\"master-volume\"> </div> </li> <li> <span>Music Volume</span> <div class=\"slider\" name=\"music-volume\"> </div> </li> <li> <span>Sound FX Volume</span> <div class=\"slider\" name=\"fx-volume\"> </div> </li> </ul> </div>");
window.modules.navigation.prototype.modules.settings.prototype.hook={};
window.modules.navigation.prototype.modules.settings.prototype.hook.comms=function() {
        const self = this;
	const state = self.state;
	let pendingMessage = true;
	
	let settings = self.state.settings = waject({
	    masterSound: 0,
	    masterVolume: 0,
	    musicVolume: 0,
	    fxVolume: 0,
	    serverSettings: {}
	});
	self.share.soundSettings = settings;
	
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
	
	function sendUpdate(target) {
	    target.serverSettings = {
	        masterSound: target.masterSound,
	        masterVolume: target.masterVolume,
	        musicVolume: target.musicVolume,
	        fxVolume: target.fxVolume
	    };
	    socket.emit('sound-settings', target.serverSettings);
	    pendingMessage = false;
	}
	
	// initialize settings state
	new self.hook.settingState;
	
	
	// Emit a socket sound-settings event.
	// This allows the server to stay in-sync
	// with the client when changes occur.
	settings.on('set', result => {
	    if (pendingMessage) {
	        return;
	    }
	    if (!self.share.utility.isServerUpdatable(result)) {
	        return;
	    }
	    pendingMessage = true;
	    if (self.share.mouseIsDown) {
	        $(document).one('mouseup', () => sendUpdate(result.target));
	    } else {
	        sendUpdate(result.target);
	    }
	});
	
	
	socket.on('sound-settings', serverSettings => {
	    settings.serverSettings = serverSettings;
	    settings['*'] = serverSettings;
	    pendingMessage = false;
	});
	
	socket.emit("sound-settings-ready");
    };
    window.modules.navigation.prototype.modules.settings.prototype.hook.comms.prototype = window.modules.navigation.prototype.modules.settings.prototype;
window.modules.navigation.prototype.modules.settings.prototype.hook.settingState=function() {
        const self = this;
	const settings = self.state.settings;
	
	function putBetween (min, max) {
	    return function (result) {
	
	        val = Math.round(parseInt(result.value));
	        if (val < min) {
	            val = min;
	        } else if (val > max) {
	            val = max;
	        } 
	
	        if (isNaN(val)) {
	            val = min;
	        }
	
	        result.value = val;
	    };
	}
	
	// Ensure masterSound is 0 or 1.
	settings.on('set', 'masterSound', putBetween(0, 1));
	
	// Emit a master-sound event 
	// This allows things outside of
	// this module to listen for changes.
	settings.on('set', 'masterSound', (result) => {
	    self.share.eventLoop.emit('master-sound', result.value);
	});
	
	// Enable/Disable all Audio
	settings.on('set', 'masterSound', (result) => {
	    if (result.value) {
	        Howler.mute(false);
	    }
	    if (!result.value) {
	        Howler.mute(true);
	    }
	});
	
	// Ensure masterVolume is between 0 and 100.
	settings.on('set', 'masterVolume', putBetween(0, 100));
	
	// Set Master Volume
	settings.on('set', 'masterVolume', (result) => {
	    Howler.volume(result.value / 100);
	});
	
	// Ensure musicVolume is between 0 and 100.
	settings.on('set', 'musicVolume', putBetween(0, 100));
	
	// Set Music Volume
	settings.on('set', 'musicVolume', (result) => {
	    self.share.sounds.music.volume(result.value / 100);
	});
	
	// Ensure fxVolume is between 0 and 100.
	settings.on('set', 'fxVolume', putBetween(0, 100));
	
	// Set Music Volume
	settings.on('set', 'fxVolume', (result) => {
	    let sounds = self.share.sounds;
	    for (let sound in sounds) {
	        if (sound === "music") {
	            continue;
	        }
	        sounds[sound].volume(result.value / 100);
	    }
	});
	
    };
    window.modules.navigation.prototype.modules.settings.prototype.hook.settingState.prototype = window.modules.navigation.prototype.modules.settings.prototype;

    window.modules.utility.prototype.parent = window;
    window.modules.utility.prototype.state = {};
    window.modules.utility.prototype.share = __SHARE__;
    window.modules.utility.prototype.loaded = false;
    window.modules.utility.prototype.functions={};
window.modules.utility.prototype.functions.isServerUpdatable=function() {
        this.share.utility.isServerUpdatable = function isServerUpdatable(result) {
	    let target = result.target;
	    let s = target.serverSettings;
	    
	    if (Object.keys(s).length !== Object.keys(target).length - 1) {
	        return false;
	    }
	    if (result.target.serverSettings[result.key] !== result.value) {
	        return true;
	    }
	    for (let setting in s) {
	        if (target[setting] !== s[setting]) {
	            return true;
	        }
	    }
	
	    return false;
	}
    };
    window.modules.utility.prototype.functions.isServerUpdatable.prototype = window.modules.utility.prototype;
window.modules.utility.prototype.manipulators={};
window.modules.utility.prototype.manipulators.waject=function() {
        waject.extend('bindInput', function (
	        prop, 
	        element, 
	        event='change',
	        inHandler=(element, p, prop) => {
	            p[prop] = $(element).val();
	        },
	        outHandler=(element, val) => {
	            $(element).val(val);
	        }) {
	    if (typeof prop === "object") {
	        element = prop.element;
	        event = prop.event || event;
	        inHandler = prop.inHandler || inHandler;
	        outHandler = prop.outHandler || outHandler;
	        prop = prop.property;
	    }
	    $(element).on(event, () => 
	        inHandler(element, this.proxy, prop));
	    this.proxy.on('set', prop, (result) => 
	        outHandler(element, result.value));
	    outHandler(element, this.target[prop]);
	});
	
    };
    window.modules.utility.prototype.manipulators.waject.prototype = window.modules.utility.prototype;
