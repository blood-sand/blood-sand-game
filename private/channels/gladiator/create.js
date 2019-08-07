const jsonSL = require('json-sl');
const names = require('./names.json');
const MAX_ABILITY_SUM = 91;
const MAX_STAT_SIZE = 25;
console.log("hi!");
const attributeGenerator = require('../../jsonSL/attributes.json');
const cultureBiometrics = require('../../jsonSL/culture_biometrics.json');
const combatStats = require('../../jsonSL/combat_stats.json');
const sexes = {
    male: 0,
    female: 1
};
function createGlatiator (m, session) {
    const socket = session.socket;
    let gladiator;
    let culture = -1;
    let sex = 0;
    if (!session.gladiator) {
        gladiator = session.gladiator = {};
        gladiator.stats = {
            strength: 0,
            dexterity: 0,
            perception: 0,
            endurance: 0,
            intelligence: 0,
            willpower: 0,
            vitality: 0,
            abilitySum: 0
        };

        gladiator.cultureInfo = {
            Roman: "The culture of ancient Rome existed throughout the almost 1200-year history of the civilization of Ancient Rome. The term refers to the culture of the Roman Republic, later the Roman Empire, which at its peak covered an area from Lowland Scotland and Morocco to the Euphrates.",
            Gallic: "Gaul was divided by Roman administration into three provinces, which were sub-divided in the later third century reorganization under Diocletian, and divided between two dioceses, Galliae and Viennensis, under the Praetorian prefecture of Galliae. On the local level, it was composed of civitates which preserved, broadly speaking, the boundaries of the formerly independent Gaulish tribes, which had been organised in large part on village structures that retained some features in the Roman civic formulas that overlaid them.\n\nOver the course of the Roman period, an ever-increasing proportion of Gauls gained Roman citizenship. In 212 the Constitutio Antoniniana extended citizenship to all free-born men in the Roman Empire.",
            Germanic: "info about Germanics...",
            Syrian: "info about Syrians...",
            Numidian: "info about Numidians...",
            Thracian: "info about Thracians...",
            Greek: "info about Greeks...",
            Iberian: "info about Iberians...",
            Judean: "info about Judeans...",
            Scythian: "info about Scythians...",
        };
        gladiator.biometrics = null;
        gladiator.stats = jsonSL(attributeGenerator);
        console.log("Generated Stats.")
        console.log(gladiator.stats);
    } else {
        gladiator = session.gladiator;
        console.log("found gladiator in cache.");
    }

    function generateBiometrics () {
        if (culture === -1) {
            return;
        }
        cultureBiometrics.sex = sex;
        cultureBiometrics.culture = culture;
        gladiator.biometrics = jsonSL(cultureBiometrics);
        socket.emit("gladiator-biometrics", gladiator.biometrics)
        generateCombatStats();
    }

    function generateCombatStats () {
        // not yet implemented things:
        let input = {
            "tactics": 0,
            "weaponSkill": 0,
            "weaponOffense": 15,
            "weaponWeight": 0,
            "dodgeSkill": 0,
            "parrySkill": 0,
            "weaponParry": 15,
            "shieldParry": 0,
            "lifestyleModifier": 0,
            "fatigueModifier": 1,
            "bmiModifier": 0
        };
        for (let field in gladiator.biometrics) {
            input[field] = gladiator.biometrics[field];
        }
        for (let field in gladiator.stats) {
            input[field] = gladiator.stats[field];
        }
        combatStats.input = input;
        gladiator.combatStats = jsonSL(combatStats);
        console.log(gladiator.combatStats);
        socket.emit("gladiator-combatStats", gladiator.combatStats);
    }

    socket.emit("gladiator-names", names);
    socket.emit("gladiator-culture-info", gladiator.cultureInfo);
    socket.emit("gladiator-stats", gladiator.stats);

    socket.on("gladiator-culture", newCulture => {
        culture = newCulture;
        generateBiometrics();
    });

    socket.on("gladiator-sex", newSex => {
        sex = newSex;
        generateBiometrics();
    });
}

module.exports = createGlatiator;