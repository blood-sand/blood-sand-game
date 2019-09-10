const path = require('path');

const soundSettings = require(path.join(__dirname, 'user/sound.js'));
module.exports = function (m, local) {
    const socket = local.socket;
    socket.on("sound-settings-ready", () => soundSettings(m, local));
}