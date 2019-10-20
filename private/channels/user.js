// Module Start
// Users
const path = require('path');
const soundSettings = require(path.join(__dirname, 'user/sound.js'));

// Module export
module.exports = function(m, local) {
  const socket = local.socket;

  socket.on("sound-settings-ready", () => soundSettings(m, local));
}
// Module End
