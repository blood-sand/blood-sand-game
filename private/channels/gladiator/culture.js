const NAME_MAX_LENGTH = 32;
const NUM_SEXES = 2;
const NUM_CULTURES = 10;
const names = require('./names.json');
const cultureInfo = {
    Roman: "The culture of ancient Rome existed throughout the almost 1200-year history of the civilization of Ancient Rome. The term refers to the culture of the Roman Republic, later the Roman Empire, which at its peak covered an area from Lowland Scotland and Morocco to the Euphrates.",
    Gallic: "Gaul was divided by Roman administration into three provinces, which were sub-divided in the later third century reorganization under Diocletian, and divided between two dioceses, Galliae and Viennensis, under the Praetorian prefecture of Galliae. On the local level, it was composed of civitates which preserved, broadly speaking, the boundaries of the formerly independent Gaulish tribes, which had been organised in large part on village structures that retained some features in the Roman civic formulas that overlaid them.\n\nOver the course of the Roman period, an ever-increasing proportion of Gauls gained Roman citizenship. In 212 the Constitutio Antoniniana extended citizenship to all free-born men in the Roman Empire.",
    Germanic: "info about Germanics...",
    Syrian: "info about Syrians...",
    Numidian: "info about Numidians...",
    Thracian: "info about Thracians...",
    Greek: "info about Greeks...",
    Iberian: "info about Iberians...",
    Judean: "info about Judeans...",
    Scythian: "info about Scythians..."
};
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
    const socket = local.socket;
    const session = local.session;

    socket.emit("gladiator-names", names);
    socket.emit("gladiator-culture-info", cultureInfo);
    
    if (session.name === undefined) {
        session.name = "";
    }

    if (session.sex === undefined || session.sex < 0 || session.sex >= NUM_SEXES) {
        session.sex = 0;
    }

    if (session.culture === undefined || 
        session.culture < 0 || 
        session.culture >= NUM_CULTURES) {
            session.culture = 0;
    }

    socket.emit("gladiator-name", session.name);
    socket.emit("gladiator-sex", Object.keys(sexes)[session.sex]);
    socket.emit("gladiator-culture", Object.keys(cultures)[session.culture]);

    socket.on('gladiator-culture', culture => {
        session.culture = (culture in cultures ? cultures[culture] : 0);
        console.log("new culture:", session.culture);
    });

    socket.on('gladiator-sex', sex => {
        session.sex = (sex in sexes ? sexes[sex] : 0);
        console.log("new sex:", session.sex);
    });

    socket.on('gladiator-name', name => {
        if (typeof name === "string" && name.length < NAME_MAX_LENGTH) {
            session.name = name;
            console.log("new name:", session.name);
        } else {
            console.log("invalid name:", name);
            socket.emit("gladiator-name", session.name);
        }
    });

    socket.on("gladiator-next", data => {
        console.log("gladiator-next (from culture)");
        console.log("current state:", session);
    });

}