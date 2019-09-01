const jsonSL = require('json-sl');

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
	
}