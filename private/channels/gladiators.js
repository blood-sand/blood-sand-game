const path = require('path');
//const createGladiator = require(path.join(__dirname, 'gladiator/create.js'));
const gladiatorCulture = require(path.join(__dirname, 'gladiator/culture.js'));
const gladiatorAttributes = require(path.join(__dirname, 'gladiator/attributes.js'));
module.exports = function (m, session) {
    const socket = session.socket;
    socket.on("gladiator-culture-ready", () => gladiatorCulture(m, session));
    socket.on("gladiator-attributes-ready", () => gladiatorAttributes(m, session));
}