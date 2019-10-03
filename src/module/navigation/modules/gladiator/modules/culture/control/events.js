const self = this;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const sexes = [
    "male",
    "female"
];
const cultures = [
    "roman",
    "gallic",
    "germanic",
    "syrian",
    "numidian",
    "thracian",
    "greek",
    "iberian",
    "judean",
    "scythian"
];

$('body').on('change', '[name="culture"]', e => {
    self.state.culture = $(e.target).val();
});

$('body').on('change', '[name="sex"]', e => {
    self.state.sex = $(e.target).val();
});

$('body').on('change', '[name="name"]', e => {
    self.state.name = e.target.value;
});
$('body').on('click', '.randomizeName', e => {
    self.generateName();
});
$('body').on('click', '.randomizeCulture', e => {
    let randCulture = getRandomInt(0, 9);
    let randSex = getRandomInt(0, 1);
    self.state.culture = cultures[randCulture];
    self.state.sex = sexes[randSex];
    self.generateName();
});
$('[name="cultureNext').on('click', e => {
    if (self.state.culture === "culture") {
        return;
    }
    self.state.next = true;
});
