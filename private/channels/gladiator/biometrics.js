const jsonSL = require('json-sl');
const sexes = {
    male: 0,
    female: 1
};
const cultures = {

}
module.exports = function (m, local) {
    const biometricsGenerator = require('../../jsonSL/culture_biometrics.json');
	const socket = local.socket;
    const session = local.session;
    if (!session.biometrics) {
        biometricsGenerator.sex = session.sex;
        biometricsGenerator.culture = session.culture;
        session.biometrics = jsonSL(biometricsGenerator);
    }
	console.log(session.biometrics);
	socket.emit("gladiator-biometrics", session.biometrics);
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