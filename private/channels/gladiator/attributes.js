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
    if (session.attributes.abilitySum > 91) {
        session.attributes.abilitySum = 91;
    }
	console.log(session.attributes);
	socket.emit("gladiator-attributes", session.attributes);
	socket.on("gladiator-attributes-change", stats => {
        let sum = 0;
        let tempStats = Object.assign(session.attributes);
        //console.log("new stats:", stats);
        for (let field in session.attributes) {
            if (field === "abilitySum") {
                continue;
            }
            if ((field in stats) && 
                !isNaN(+stats[field]) &&
                stats[field] >= MIN_STAT_SIZE && 
                stats[field] <= MAX_STAT_SIZE) {
                tempStats[field] = stats[field];
                sum += tempStats[field];
                console.log(field, tempStats[field])
            }
        }
        console.log(sum);
        if (sum <= MAX_ABILITY_SUM) {
            tempStats.abilitySum = sum;
            session.attributes = tempStats;
            
        }
        console.log("new stats:", session.attributes);
        socket.emit("gladiator-attributes", session.attributes);
    });
}