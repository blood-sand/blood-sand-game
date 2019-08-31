const path = require('path');
//const createGladiator = require(path.join(__dirname, 'gladiator/create.js'));
const gladiatorCulture = require(path.join(__dirname, 'gladiator/culture.js'));
const gladiatorAttributes = require(path.join(__dirname, 'gladiator/attributes.js'));
const gladiatorBiometrics = require(path.join(__dirname, 'gladiator/biometrics.js'));
module.exports = function (m, local) {
    const socket = local.socket;
    socket.on("gladiator-culture-ready", () => gladiatorCulture(m, local));
    socket.on("gladiator-attributes-ready", () => gladiatorAttributes(m, local));
    socket.on("gladiator-biometrics-ready", () => gladiatorBiometrics(m, local))
}