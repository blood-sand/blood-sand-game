const jsonSL = require('json-sl');
const attributeGenerator = require('../../jsonSL/attributes.json');
const bmiModifiers = require('../../jsonSL/bmi_modifiers.json');
const ageModifiers = require('../../jsonSL/age_modifiers.json');

const MAX_ABILITY_SUM = 91;
const MAX_STAT_SIZE = 18;
const MIN_STAT_SIZE = 3

module.exports = function (m, local) {
    let final = {};
    const socket = local.socket;
    const session = local.session;

    local.handleAttributesChange = function(stats) {
        let sum = 0;
        let tempStats = Object.assign(session.attributes);
        //console.log("new stats:", stats);
        for (let field in session.attributes) {
            if (field === "abilitySum" || field === "modifiers") {
                continue;
            }
            if ((field in stats) && 
                !isNaN(+stats[field]) &&
                stats[field] >= MIN_STAT_SIZE && 
                stats[field] <= MAX_STAT_SIZE) {
                tempStats[field] = stats[field];
                sum += tempStats[field];
            }
        }
        if (sum <= MAX_ABILITY_SUM) {
            tempStats.abilitySum = sum;
            session.attributes = tempStats;
            
        }
        local.assignModifiers();
        session.attributes.modifiers.final = {};
        for (let field in session.attributes) {
            if (field === "abilitySum" || field === "modifiers") {
                continue;
            }
            session.attributes.modifiers.final[field] = final[field];
        }
        session.skills.skillPoints = local.calcSkillPoints();
        socket.emit("gladiator-skills", session.skills);
        socket.emit("gladiator-attributes", session.attributes);
    }

    if (!session.attributes) {
        session.attributes = jsonSL(attributeGenerator);
        session.attributes.modifiers = {
            age: {},
            bmi: {},
            sex: {},
            final: {}
        };
        
    }
    if (session.attributes.abilitySum > 91) {
        session.attributes.abilitySum = 91;
    }

    for (let attr in session.attributes) {
        if (attr === "abilitySum" || attr === "modifiers") {
            continue;
        }
        Object.defineProperty(final, attr, {
            get () {
                let val = session.attributes[attr];
                if (attr in session.attributes.modifiers.age) {
                    val += session.attributes.modifiers.age[attr];
                }
                if (attr in session.attributes.modifiers.bmi) {
                    val += session.attributes.modifiers.bmi[attr];
                }
                if (attr in session.attributes.modifiers.sex) {
                    val += session.attributes.modifiers.sex[attr];
                }
                return val;
            },
            enumerable: true
        });
        session.attributes.modifiers.final[attr] = final[attr];
    }

    socket.emit("gladiator-attributes", session.attributes);
    socket.on("gladiator-attributes-change", local.handleAttributesChange);
}