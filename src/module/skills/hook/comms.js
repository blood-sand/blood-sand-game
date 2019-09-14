const self = this;

let totalSkillPoints = 10;

self.state.mk({
	property: 'next',
	value: false,
	preset: () => {
		$('#skills').hide('slide', {
            direction: 'left'
        }, 250);
        self.share.slideDirection = 'right';
		modules.fetch('combatStats');
	}
});

self.state.mk({
	property: 'previous',
	value: false,
	preset: () => {
		$('#skills').hide('slide', {
            direction: 'right'
        }, 250);
        self.share.slideDirection = 'left';
		modules.fetch('combatStats');
	}
});

self.state.mk({
	property: "skillPoints",
	value: totalSkillPoints,
	preset: (o, name, val) => {
		if (val > -1) {
			console.log("skill points:", val);
			$('#skills [name=skillPoints]').text(val);
			return true;
		}
		return false;
	}
});

function setDescription (skill, val) {
	let desc = "Terrible";
	if (val > 10) {
		desc = "Bad";
	}
	if (val > 20) {
		desc = "Okay";
	}
	$(`#skills [name=${skill}]`).siblings('.description').text(desc);
}

function generateSkills (skill, val) {
	let attr = modules.attributes.prototype.state.attributes;
	let biometrics = modules.biometrics.prototype.state.biometrics;
	console.log(skill, val, attr, biometrics);
	let generator = {
		"input": {
			"skill": skill,
			"skillpointsspent": val,
			"skillvalue": 0,
			"dexterity": attr.dexterity,
			"endurance": attr.endurance,
			"perception": attr.perception,
			"strength": attr.strength,
			"vitality": attr.vitality,
			"willpower": attr.willpower,
			"intelligence": attr.intelligence,
			"rank": biometrics.rank,
			"tacticspoints": 0
		},

		"skill": "input.skill",
		"skillpointsspent": "input.skillpointsspent",
		"skillvalue": "input.skillvalue",
		"tactics": "0.1*(input.intelligence+input.rank/10*20)/2*input.tacticspoints",

		"dodgemod": "0.1+(0.9*(input.dexterity+input.perception)/30)+0.15*tactics/15",
		"parrymod": "0.1+(0.9*(input.strength+input.dexterity+input.perception+input.intelligence)/60)+0.15*tactics/15",
		"shieldmod": "0.1+(0.9*(input.strength+input.endurance)/30)+0.15*tactics/15",
		"bashmod": "0.1+(0.9*(input.strength+input.dexterity)/30)+0.15*tactics/15",
		"chargemod": "0.1+(0.9*(input.strength+input.dexterity)/30)+0.15*tactics/15",
		"spearsmod": "0.05+(0.95*(input.strength+input.dexterity+input.perception)/45)+0.2*tactics/15",
		"lightbladesmod": "0.05+(0.85*(input.dexterity+input.perception)/30)+0.3*tactics/15",
		"heavybladesmod": "(0.85*(input.strength+input.endurance)/30)+0.4*tactics/15",
		"bludgeoningmod": "0.2+(1*(input.strength+input.endurance+input.willpower)/45)",
		"axesmod": "0.05+(0.95*(input.strength+input.endurance+input.perception)/45)+0.2*tactics/15",
		"ripostemod": "0.1+(0.8*(input.dexterity+input.perception+input.intelligence)/45)+0.3*tactics/15",
		"closecombatmod": "0.2+(0.85*(input.strength+input.dexterity+input.perception+input.endurance)/60)+0.15*tactics/15",
		"feintmod": "0.2+(0.65*(input.dexterity+input.intelligence)/30)+0.35*tactics/15",
		"dirtytricksmod": "0.2+1*(input.dexterity+input.perception+2*input.intelligence)/60",
		"appraisemod": "0.2+0.7*(input.perception+input.intelligence)/30+0.3*tactics/15",

		"skilltype if skill is 0": "0",
		"skilltype if skill is 1": "0",
		"skilltype if skill is 2": "1",
		"skilltype if skill is 3": "2",
		"skilltype if skill is 4": "2",
		"skilltype if skill is 5": "1",
		"skilltype if skill is 6": "1",
		"skilltype if skill is 7": "0",
		"skilltype if skill is 8": "0",
		"skilltype if skill is 9": "0",
		"skilltype if skill is 10": "1",
		"skilltype if skill is 11": "0",
		"skilltype if skill is 12": "2",
		"skilltype if skill is 13": "1",
		"skilltype if skill is 14": "1",

		"skillmax if skilltype is 0": "16",
		"skillmax if skilltype is 1": "12",
		"skillmax if skilltype is 2": "8",

		"skillvalue if skilltype is 0": {
			"value if parent.skillpointsspent is 0": 0 ,
			"value if parent.skillpointsspent is 1": 9 ,
			"value if parent.skillpointsspent is 2": 17.5 ,
			"value if parent.skillpointsspent is 3": 25.5 ,
			"value if parent.skillpointsspent is 4": 33 ,
			"value if parent.skillpointsspent is 5": 40 ,
			"value if parent.skillpointsspent is 6": 46.5 ,
			"value if parent.skillpointsspent is 7": 52.5 ,
			"value if parent.skillpointsspent is 8": 58 ,
			"value if parent.skillpointsspent is 9": 63 ,
			"value if parent.skillpointsspent is 10": 67.5 ,
			"value if parent.skillpointsspent is 11": 71.5 ,
			"value if parent.skillpointsspent is 12": 75 ,
			"value if parent.skillpointsspent is 13": 78 ,
			"value if parent.skillpointsspent is 14": 80.5 ,
			"value if parent.skillpointsspent is 15": 82.5 ,
			"value if parent.skillpointsspent is 16": 84 
		},
		"skillvalue if skilltype is 1": {
			"value if parent.skillpointsspent is 0": 0 ,
			"value if parent.skillpointsspent is 1": 12.01 ,
			"value if parent.skillpointsspent is 2": 23.11 ,
			"value if parent.skillpointsspent is 3": 33.3 ,
			"value if parent.skillpointsspent is 4": 42.58 ,
			"value if parent.skillpointsspent is 5": 50.95 ,
			"value if parent.skillpointsspent is 6": 58.41 ,
			"value if parent.skillpointsspent is 7": 64.96 ,
			"value if parent.skillpointsspent is 8": 70.6 ,
			"value if parent.skillpointsspent is 9": 75.33 ,
			"value if parent.skillpointsspent is 10": 79.15 ,
			"value if parent.skillpointsspent is 11": 82.06 ,
			"value if parent.skillpointsspent is 12": 84.06 
		},
		"skillvalue if skilltype is 2": {
			"value if parent.skillpointsspent is 0": 0 ,
			"value if parent.skillpointsspent is 1": 18.05 ,
			"value if parent.skillpointsspent is 2": 33.95 ,
			"value if parent.skillpointsspent is 3": 47.7 ,
			"value if parent.skillpointsspent is 4": 59.3 ,
			"value if parent.skillpointsspent is 5": 68.75 ,
			"value if parent.skillpointsspent is 6": 76.05 ,
			"value if parent.skillpointsspent is 7": 81.2 ,
			"value if parent.skillpointsspent is 8": 84.2 
		},
		"skillfinal if skill is 0": "dodgemod*skillvalue",
		"skillfinal if skill is 1": "parrymod*skillvalue",
		"skillfinal if skill is 2": "shieldmod*skillvalue",
		"skillfinal if skill is 3": "bashmod*skillvalue",
		"skillfinal if skill is 4": "chargemod*skillvalue",
		"skillfinal if skill is 5": "spearsmod*skillvalue",
		"skillfinal if skill is 6": "lightbladesmod*skillvalue",
		"skillfinal if skill is 7": "heavybladesmod*skillvalue",
		"skillfinal if skill is 8": "bludgeoningmod*skillvalue",
		"skillfinal if skill is 9": "axesmod*skillvalue",
		"skillfinal if skill is 10": "ripostemod*skillvalue",
		"skillfinal if skill is 11": "closecombatmod*skillvalue",
		"skillfinal if skill is 12": "feintmod*skillvalue",
		"skillfinal if skill is 13": "dirtytricksmod*skillvalue",
		"skillfinal if skill is 14": "appraisemod*skillvalue"
	};

	return jsonSL(generator).skillfinal;
}

self.state.skillPoints = 10;
let skills = {
	"dodge": 0,
	"parry": 0,
	"shield": 0,
	"bash": 0,
	"charge": 0,
	"spear": 0,
	"lightBlade": 0,
	"heavyBlade": 0,
	"bludgeoning": 0,
	"axe": 0,
	"riposte": 0,
	"closeCombat": 0,
	"feint": 0,
	"dirtyTrick": 0,
	"appraise": 0
};

let skillLabels = [
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

self.state.skills = waject();
for (let label in skills) {
	$(`#skills [name=${label}]`).siblings('.proficiency').text("0.00");
	setDescription(label, 0);
	self.state.skills.mk({
		property: label,
		value: 0,
		preset: (o, name, val) => {
			console.log("skill set:", name, val);
			let skillPoints = totalSkillPoints;
			for (let skill in o) {
				if (!(skill in skills) || skill === "toString") {
					continue;
				}
				if (skill === name) {
					console.log("-",skill,val)
					skillPoints -= val;
				} else {
					console.log("-",skill,o[skill])
					skillPoints -= o[skill];
				}
			}
			console.log("new skill points:", skillPoints);
			if (skillPoints < 0) {
				return false;
			}
			self.state.skillPoints = skillPoints;
			let result = generateSkills(skillLabels.indexOf(name), val);
			console.log(result);
			$(`#skills [name=${name}]`).siblings('.proficiency').text(result.toFixed(2));
			setDescription(name, result);
		}
	});
}