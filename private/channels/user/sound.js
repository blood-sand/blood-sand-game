// Module Start
// Sound settings
let settingValues = {
  masterSound: /0|1/,
  masterVolume: /[0-9][0-9]?0?/,
  musicVolume: /[0-9][0-9]?0?/,
  fxVolume: /[0-9][0-9]?0?/
};

// Module export
module.exports = function(m, local) {
  let session = local.session;
  let socket = local.socket;

  if (typeof session.sound === 'object') {
    for (let label in session.sound) {
      if (!(label in settingValues)) {
        console.log('bad sess! (sound)');

        session.sound = undefined;

        break;
      }
    }
    if (session.sound !== undefined) {
      for (let label in settingValues) {
        if (!(label in session.sound)) {
          console.log('bad sess(2)! (sound)');

          session.sound = undefined;

          break;
        }
        if (!settingValues[label].test(session.sound[label])) {
          console.log('bad sess format! (sound)');

          session.sound = undefined;

          break;
        }
      }
    }
  }
  if (session.sound === undefined) {
    session.sound = {
      masterSound: null,
      masterVolume: 75,
      musicVolume: 75,
      fxVolume: 75,
    }
  }

  //console.log('sound settings:', session.sound);

  socket.emit('sound-settings', session.sound)
  socket.on('sound-settings', settings => {
    for (let label in settings) {
      if (label in settingValues && settingValues[label].test(settings[label])) {
        session.sound[label] = settings[label];
      }
    }

    //console.log('new sound settings:', session.sound);
  });
}
// Module End
