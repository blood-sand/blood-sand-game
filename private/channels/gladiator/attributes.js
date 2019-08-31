const jsonSL = require('json-sl');
const attributeGenerator = require('../../jsonSL/attributes.json');

const MAX_ABILITY_SUM = 91;
const MAX_STAT_SIZE = 18;
const MIN_STAT_SIZE = 3



module.exports = function (m, local) {

	const socket = local.socket;
    const session = local.session;
    if (!session.attributes) {
        session.attributes = jsonSL(attributeGenerator);
    }
	console.log(session.attributes);
	socket.emit("gladiator-attributes", session.attributes);
	socket.on("gladiator-attributes-change", stats => {
        let sum = 0;
        console.log("new stats:", stats);
        for (let field in session.attributes) {
            if (field === "abilitySum") {
                continue;
            }
            if ((field in stats) && 
                !isNaN(+stats[field]) &&
                stats[field] >= MIN_STAT_SIZE && 
                stats[field] <= MAX_STAT_SIZE) {
                session.attributes[field] = stats[field];
            }
            sum += session.attributes[field];
        }
        session.attributes.abilitySum = sum;
        socket.emit("gladiator-attributes", session.attributes)
        //TODO: generateBiometrics();
    });
}