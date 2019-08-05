const path = require('path');
console.log(path.join(__dirname, 'gladiator/create.js'))
const createGladiator = require(path.join(__dirname, 'gladiator/create.js'));
module.exports = function (m, session) {
    const socket = session.socket;
    socket.on("gladiator-create-ready", () => createGladiator(m, session));
}