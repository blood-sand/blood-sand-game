const jsonSL = require('json-sl');

module.exports = function (m, local) {
    const combatStatsGenerator = require('../../jsonSL/combat_stats.json');
	const socket = local.socket;
    const session = local.session;
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
        Object.assign(input, session.biometrics, session.attributes);
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