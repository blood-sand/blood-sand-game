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
    Scythian: "info about Scythians...",
};
module.exports = function (m, session) {
	const socket = session.socket;
	socket.emit("gladiator-names", names);
    socket.emit("gladiator-culture-info", cultureInfo);
	socket.on("gladiator-next", data => {
		console.log("gladiator-next:", data);
	});

}