const jsonSL = require('json-sl');
const attributeGenerator = require('../../jsonSL/attributes.json');

const MAX_ABILITY_SUM = 91;
const MAX_STAT_SIZE = 18;
const MIN_STAT_SIZE = 3

let attributes = jsonSL(attributeGenerator);


module.exports = function (m, session) {
	const socket = session.socket;
	console.log(attributes);
	socket.emit("gladiator-attributes", attributes);
	socket.on("gladiator-attributes-change", stats => {
        let sum = 0;
        console.log("new stats:", stats);
        for (let field in attributes) {
            if (field === "abilitySum") {
                continue;
            }
            if ((field in stats) && 
                !isNaN(+stats[field]) &&
                stats[field] >= MIN_STAT_SIZE && 
                stats[field] <= MAX_STAT_SIZE) {
                attributes[field] = stats[field];
            }
            sum += attributes[field];
        }
        attributes.abilitySum = sum;
        socket.emit("gladiator-attributes", attributes)
        //TODO: generateBiometrics();
    });
}