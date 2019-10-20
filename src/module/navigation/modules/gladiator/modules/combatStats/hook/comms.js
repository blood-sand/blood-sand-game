// Hooke
const self = this;
let combatStatsLabels = [
  'health',
  'stamina',
  'staminaRecovery',
  'initiative',
  'nerve',
  'offense',
  'defense',
  'dodge',
  'parry'
];

socket.on('gladiator-combatStats', data => {
  combatStatsLabels.forEach(name => {
    if (name in data) {
      let val = data[name];

      if (/\./.test('' + val)) {
        val = val.toFixed(2);
      }

      $(`[name='${name}']`).val(val);
    }
  });
});
socket.emit('gladiator-combatStats-ready');
