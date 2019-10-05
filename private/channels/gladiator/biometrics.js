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
    if (!session.rank) {
        session.rank = 1;
    }
    function generateBiometrics () {
        biometricsGenerator.sex = session.sex;
        biometricsGenerator.culture = session.culture;
        biometricsGenerator.rank = session.rank;
        session.biometrics = jsonSL(biometricsGenerator);
        
        console.log(session.biometrics);
        socket.emit("gladiator-biometrics", session.biometrics);
        socket.emit('gladiator-rank', session.rank);
    }
    if (session.biometrics) {
        socket.emit("gladiator-biometrics", session.biometrics);
        socket.emit('gladiator-rank', session.rank);
    } else {
        generateBiometrics();
    }
    socket.on('gladiator-biometrics-rank', newRank => {
        let rank = parseInt(newRank);
        if (!isNaN(rank) && rank > 0 && rank < 16) {
            session.rank = newRank;
            socket.emit('gladiator-rank', session.rank);
        }
    });
    socket.on('gladiator-biometrics-generate', generateBiometrics);
    socket.on('gladiator-culture', generateBiometrics);
    socket.on('gladiator-sex', generateBiometrics);
}
