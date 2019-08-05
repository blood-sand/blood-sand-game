const jsonSL = require('json-sl');
const MAX_ABILITY_SUM = 91;
const MAX_STAT_SIZE = 25;

const attributeGenerator = {
    "strength": "rand(1,6)+rand(1,6)+rand(1,6)",
    "dexterity": "rand(1,6)+rand(1,6)+rand(1,6)",
    "perception": "rand(1,6)+rand(1,6)+rand(1,6)",
    "endurance": "rand(1,6)+rand(1,6)+rand(1,6)",
    "intelligence": "rand(1,6)+rand(1,6)+rand(1,6)",
    "willpower": "rand(1,6)+rand(1,6)+rand(1,6)",
    "vitality": "rand(1,6)+rand(1,6)+rand(1,6)",
    "abilitySum": "strength+dexterity+perception+endurance+intelligence+willpower+vitality"
};

function createGlatiator (m, session) {
    const socket = session.socket;
    let gladiator;
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

        gladiator.stats = jsonSL(attributeGenerator);
        console.log("Generated Stats.")
        console.log(gladiator.stats);
    } else {
        gladiator = session.gladiator;
        console.log("found gladiator in cache.");
    }

    socket.emit("gladiator-culture-info", gladiator.cultureInfo);
    socket.emit("gladiator-stats", gladiator.stats);
}

module.exports = createGlatiator;