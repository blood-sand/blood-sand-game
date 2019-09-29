const skillMappings = [
    "dodge",
    "parry",
    "shield",
    "bash",
    "charge",
    "spear",
    "lightBlade",
    "heavyBlade",
    "bludgeoning",
    "axe",
    "riposte",
    "closeCombat",
    "feint",
    "dirtyTrick",
    "appraise"
];

const jsonSL = require('json-sl');

module.exports = function (m, local) {
    const skillsGenerator = require('../../jsonSL/skills.json');
    const socket = local.socket;
    const session = local.session;

    if (session.skills === undefined) {
        session.skills = {
            skillPoints: 10,
            skillCeiling: session.biometrics.rank * 2
        };
        session.skills.tactics = 0;
        skillMappings.forEach(label => {
            session.skills[label] = 0
        });
    }

    socket.on("gladiator-skill-change", data => {
        let invalid = false;
        for (skill in data) {
            let val = data[skill];
            console.log("skill update:", skill, val);
            if (skillMappings.indexOf(skill) !== -1 || skill === 'tactics') {
                if (session.skills[skill] < val) {
                    let diff = val - session.skills[skill];
                    if (session.skills.skillPoints >= diff) {
                        session.skills.skillPoints -= diff;
                    } else {
                        invalid = true;
                    }
                } else {
                    let diff = session.skills[skill] - val;
                    session.skills.skillPoints += diff;
                }
            } else {
                invalid = true;
            }
            if (!invalid) {
                session.skills[skill] = val;
                console.log('skills updated', session.skills);
            } else {
                console.log("invalid", skill, val, session.skills.skillPoints);
            }
        }
    });

    socket.emit("gladiator-skills", session.skills);
}
