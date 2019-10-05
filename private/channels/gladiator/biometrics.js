const jsonSL = require('json-sl');
const bmiModifiersGen = require('../../jsonSL/bmi_modifiers.json');
const ageModifiersGen = require('../../jsonSL/age_modifiers.json');
const sexModifiersGen = require('../../jsonSL/sex_modifiers.json');
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

    function assignModifiers () {
        if (!session.attributes) {
            return;
        }

        let age;
        if (session.biometrics.age !== session.attributes.modifiers.age.age) {
            let ageModInputs = {
                age: session.biometrics.age
            };
            age = jsonSL(Object.assign(ageModifiersGen, {input: ageModInputs}));
            delete age.input;
            session.attributes.modifiers.age = age;
        }
        let bmi;
        if (session.biometrics.bmi !== session.attributes.modifiers.bmi.bmi) {
            let bmiModInputs = {
                bmi: session.biometrics.bmi
            };
            bmi = jsonSL(Object.assign(bmiModifiersGen, {input: bmiModInputs}));
            delete bmi.input;
            session.attributes.modifiers.bmi = bmi;
        }
        let sex;
        if (session.biometrics.sex !== session.attributes.modifiers.sex.sex) {
            let sexModInputs = {
                sex: session.biometrics.sex
            };
            sex = jsonSL(Object.assign(sexModifiersGen, {input: sexModInputs}));
            delete sex.input;
            session.attributes.modifiers.sex = sex;
        }
        if (age || bmi || sex) {
            m.handleAttributesChange(session.attributes);
        }
    }
    m.assignModifiers = assignModifiers;
    function generateBiometrics () {
        biometricsGenerator.sex = session.sex;
        biometricsGenerator.culture = session.culture;
        biometricsGenerator.rank = session.rank;
        session.biometrics = jsonSL(biometricsGenerator);
        socket.emit("gladiator-biometrics", session.biometrics);
        socket.emit('gladiator-rank', session.rank);
        console.log("new biometrics", session.biometrics);
        assignModifiers();
    }
    if (session.biometrics) {
        socket.emit("gladiator-biometrics", session.biometrics);
        socket.emit('gladiator-rank', session.rank);
        assignModifiers();
    } else {
        generateBiometrics();
    }
    socket.on('gladiator-biometrics-rank', newRank => {
        let rank = parseInt(newRank);
        console.log("new rank:", rank);
        if (!isNaN(rank) && rank > 0 && rank < 16) {
            session.rank = newRank;
            session.biometrics.rank = newRank;
            socket.emit('gladiator-rank', session.rank);
        }
    });

    socket.on('gladiator-biometrics-generate', generateBiometrics);
    socket.on('gladiator-culture', culture => {
        if (session.culture !== session.biometrics.culture) {
            generateBiometrics();
        }
    });
    socket.on('gladiator-sex', sex => {
        if (session.sex !== session.biometrics.sex) {
            generateBiometrics();
        }
    });
}
