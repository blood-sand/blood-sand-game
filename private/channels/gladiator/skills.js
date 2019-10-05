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

const skillPointMapping = [
    10,
    10,
    10,
    8,
    8,
    8,
    6,
    6,
    6,
    4,
    4,
    4,
    2,
    2,
    2
];

const jsonSL = require('json-sl');

module.exports = function (m, local) {
    const skillsGenerator = require('../../jsonSL/skills.json');
    const socket = local.socket;
    const session = local.session;

    if (session.skills === undefined) {
        session.skills = {
            skillPoints: 10,
            skillCeiling: session.rank * 2
        };
        session.skills.tactics = 0;
        skillMappings.forEach(label => {
            session.skills[label] = 0
        });
    }

    session.skills.skillPoints = calcSkillPoints();

    function calcSkillPoints () {
        let spent = 0;
        let total = 0;
        for (let i = 0; i < session.rank; i += 1) {
            total += skillPointMapping[i];
        }
        for (let label in session.skills) {
            if (skillMappings.indexOf(label) !== -1 || label === 'tactics') {
                let val = session.skills[label];
                spent += val;
            }
        }
        // Spent too much, revert!
        if (spent > total) {
            spent = 0;
            for (let label in session.skills) {
                if (skillMappings.indexOf(label) !== -1 || label === 'tactics') {
                    session.skills[label] = 0;
                }
            }
        }
        let intelligenceMod = session.attributes.modifiers.final.intelligence - 10;
        total += intelligenceMod;
        console.log("skill point calc:", intelligenceMod, total, spent, total-spent)
        return total - spent;
    }
    local.calcSkillPoints = calcSkillPoints;
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
                session.skills.skillPoints = calcSkillPoints();
                console.log('skills updated', session.skills);
            } else {
                console.log("invalid", skill, val, session.skills.skillPoints);
            }
        }
    });

    socket.on("gladiator-biometrics-rank", rank => {
        session.skills.skillPoints = calcSkillPoints();
        session.skills.skillCeiling = session.rank * 2;
        
        console.log("new rank (skills):", session.rank);
        socket.emit("gladiator-skills", session.skills);
    });

    socket.emit("gladiator-skills", session.skills);
}
