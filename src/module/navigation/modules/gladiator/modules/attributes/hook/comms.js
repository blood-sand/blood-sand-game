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
attributes.on('set', 'abilitySum', (target, prop, val) => {
    if (isNaN(val)) {
        requestAnimationFrame(() => (
            attributes[prop] = target[prop])
        );
        return false;
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
        target.abilitySum = val;
        return true;
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
        target.abilitySum = val;
        return true;
    }
});

attributes.on('set', (target, prop, val) => {
    if (prop === "serverSettings") {
        return;
    }

    if (prop === "abilitySum") {
        return;
    }

    if (isNaN(val)) {
        requestAnimationFrame(() => (
            attributes[prop] = target[prop])
        );
        return false;
    }

    if (val > target[prop]) {
        if (val > MAX_STAT_SIZE) {
            val = MAX_STAT_SIZE;
        }
        let diff = val - target[prop];
        if ((target.abilitySum + diff) > MAX_ABILITY_SUM) {
            diff -= (target.abilitySum + diff) - MAX_ABILITY_SUM;
        }
        target[prop] += diff;
        target.abilitySum += diff;
        return true;
    }

    if (val < target[prop]) {
        if (val < MIN_STAT_SIZE) {
            val = MIN_STAT_SIZE;
        }
        let diff = target[prop] - val;
        target[prop] -= diff;
        target.abilitySum -= diff;
        return true;
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

attributes.on('set', (target, prop, val) => {
    if (self.state.ignoreUpdate || 
        !updatable(target, prop, val)) {
        return;
    }
    self.state.ignoreUpdate = true;
    let update = {};
    Object.keys(attributes).forEach(prop => {
        if (prop === "serverSettings") {
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