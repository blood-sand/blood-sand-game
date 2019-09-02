const jsonSL = require('json-sl');

const sexes = {
    male: 0,
    female: 1
};
const cultures = {
    roman: 0,
    gallic: 1,
    germanic: 2,
    syrian: 3,
    numidian: 4,
    thracian: 5,
    greek: 6,
    iberian: 7,
    judean: 8,
    scythian: 9
};

module.exports = function (m, local) {
    const biometricsGenerator = require('../../jsonSL/culture_biometrics.json');
	const socket = local.socket;
    const session = local.session;
    function generateBiometrics () {
        biometricsGenerator.sex = session.sex;
        biometricsGenerator.culture = session.culture;
        session.biometrics = jsonSL(biometricsGenerator);
        
        console.log(session.biometrics);
        socket.emit("gladiator-biometrics", session.biometrics);
    }
    if (session.biometrics) {
        socket.emit("gladiator-biometrics", session.biometrics);
    } else {
        generateBiometrics();
    }
    
    socket.on('gladiator-biometrics-generate', generateBiometrics);
    socket.on('gladiator-culture', generateBiometrics);
    socket.on('gladiator-sex', generateBiometrics);
	
}