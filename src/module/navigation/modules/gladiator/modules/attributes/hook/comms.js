// Hook
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

function randomProperty(obj, f = () => true) {
  var keys = Object.keys(obj).filter(f);

  return keys[keys.length * Math.random() << 0];
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
    if (prop === 'abilitySum' ||
      prop === 'serverSettings') {
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

  if (prop === 'serverSettings') {
    return;
  }
  if (prop === 'abilitySum') {
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
    if (prop === 'serverSettings') {
      return;
    }
    if (prop === result.key) {
      update[prop] = result.value;
      return;
    }

    update[prop] = attributes[prop];
  });

  attributes.serverSettings = update;

  socket.emit('gladiator-attributes-change', update);

  self.state.ignoreUpdate = false;
});
socket.on('gladiator-attributes', data => {
  let serverSettings = {};
  let same = true;

  for (prop in data) {
    if (prop === 'abilitySum' ||
      prop === 'modifiers') {
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

socket.emit('gladiator-attributes-ready');
