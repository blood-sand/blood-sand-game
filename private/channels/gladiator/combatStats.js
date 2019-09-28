const jsonSL = require('json-sl');
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

module.exports = function (m, local) {
    const combatStatsGenerator = require('../../jsonSL/combat_stats.json');
    const skillsGenerator = require('../../jsonSL/skills.json');
	const socket = local.socket;
    const session = local.session;
    function generateSkill (skill, value) {
        let input = {
            "skill": skillMappings.indexOf(skill),
            "skillpointsspent": value,
            "skillvalue": 0,
            "dexterity": session.attributes.dexterity,
            "endurance": session.attributes.endurance,
            "perception": session.attributes.perception,
            "strength": session.attributes.strength,
            "vitality": session.attributes.vitality,
            "willpower": session.attributes.willpower,
            "intelligence": session.attributes.intelligence,
            "rank": session.biometrics.rank,
            "tacticspoints": session.skills.tactics
        };
        skillsGenerator.input = input;
        return jsonSL(skillsGenerator).skillfinal;
    }
    function generateCombatStats () {
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
        if (session.skills) {
            input.tactics = session.skills.tactics;
            input.dodgeSkill = generateSkill('dodge', session.skills.dodge);
            input.parrySkill = generateSkill('parry', session.skills.parry);
        }
        Object.assign(input, session.biometrics, session.attributes);
        console.log(input);
        combatStatsGenerator.input = input;
        let result = jsonSL(combatStatsGenerator);
        delete result.input;
        session.combatStats = result;
        console.log(session.combatStats);
        socket.emit("gladiator-combatStats", session.combatStats);
    }
    generateCombatStats();
    
    socket.on('gladiator-combatStats-generate', generateCombatStats);
	
}