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
    
    function generate (skill, value) {
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
		let result = jsonSL(skillsGenerator);
		console.log(result.skillfinal);
    }

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
    			console.log('skills updated', session.skills)
    			session.skills[skill] = val;
    		} else {
    			console.log("invalid", skill, val, session.skills.skillPoints);
    		}
    	}
    });

    socket.emit("gladiator-skills", session.skills);
    console.log("sess:", session);

}