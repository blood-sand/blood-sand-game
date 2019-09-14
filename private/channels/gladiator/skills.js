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
    
    if (!session.skillPoints === undefined) {
    	session.skillPoints = 10;
    }

    session.skillCeiling = session.biometrics.rank * 2;


}