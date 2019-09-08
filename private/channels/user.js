const path = require('path');

const userSettings = require(path.join(__dirname, 'user/settings.js'));
module.exports = function (m, local) {
    const socket = local.socket;
    socket.on("user-settings-ready", () => userSettings(m, local));
}