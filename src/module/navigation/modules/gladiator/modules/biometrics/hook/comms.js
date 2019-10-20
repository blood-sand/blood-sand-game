// Hook
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

biometricLabels.splice(biometricLabels.indexOf('serverSettings'), 1);

self.share.biometricSettings = biometrics;
self.state.biometrics = biometrics;
self.state.requestBiometrics = function() {
  console.log('requesting biometrics..');

  socket.emit('gladiator-biometrics-generate');
}

biometrics.on('set', 'rank', result => {
  if (serverRank === undefined) {
    return;
  }

  val = parseInt(result.value);

  if (val < 1 || val > 15 || isNaN(val)) {
    result.value = serverRank;

    return;
  }

  result.value = val;

  if (serverRank === val) {
    return;
  }

  serverRank = val;

  socket.emit('gladiator-biometrics-rank', val);
});

socket.on('gladiator-biometrics', data => {
  biometrics['*'] = data;
  serverRank = data.rank;
});
socket.emit('gladiator-biometrics-ready');
