const fs = require('fs');

let nameFile = fs.readFileSync('./names.txt', 'utf8').split('\n').filter(l => l != "");
console.log(nameFile);

let names = {
	roman: {
		male: [],
		female: []
	},
	gallic: {
		male: [],
		female: []
	},
	germanic: {
		male: [],
		female: []
	},
	syrian: {
		male: [],
		female: []
	},
	numidian: {
		male: [],
		female: []
	},
	thracian: {
		male: [],
		female: []
	},
	greek: {
		male: [],
		female: []
	},
	iberian: {
		male: [],
		female: []
	},
	judean: {
		male: [],
		female: []
	},
	scythian: {
		male: [],
		female: []
	}
}

let sep = /([A-Z]+)_(MALE|FEMALE)/;
let ref = null;
nameFile.forEach(line => {

	if (sep.test(line)) {
		let [full, culture, sex] = sep.exec(line);
		culture = culture.toLowerCase();
		sex = sex.toLowerCase();
		//console.log(culture, sex);
		ref = names[culture][sex];
		//console.log(ref);
	} else {
		ref.push(line);
	}
});

fs.writeFileSync("names.json", JSON.stringify(names, null, '\t'));
console.log("done.")