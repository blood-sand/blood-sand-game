const path = require('path');
//const createGladiator = require(path.join(__dirname, 'gladiator/create.js'));
const gladiatorCulture = require(path.join(__dirname, 'gladiator/culture.js'));
const gladiatorAttributes = require(path.join(__dirname, 'gladiator/attributes.js'));
module.exports = function (m, local) {
    const socket = local.socket;
    socket.on("gladiator-culture-ready", () => gladiatorCulture(m, local));
    socket.on("gladiator-attributes-ready", () => gladiatorAttributes(m, local));
}