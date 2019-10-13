const self = this;

const settings = self.state.settings;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateName () {
    if (!settings.culture || !settings.sex) {
        return;
    }
    let ref = self.state.names[settings.culture]
    if (ref) {
        ref = ref[settings.sex];
    }
    if (!ref) {
        return;
    }
    let randName = ref[Math.floor(Math.random()*ref.length)];
    settings.name = randName;
};

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

settings.bindInput('name', 
    $('#culture [name=name]')
);
settings.bindInput({
    property: 'culture',
    element: $('#culture [name=culture]'),
    outHandler: (element, val) => 
        $(element).val(val).selectric()
});
settings.bindInput({
    property: 'sex',
    element: $('#culture [name=sex]'),
    outHandler: (element, val) => 
        $(element).val(val).selectric()
});

$('#culture select').selectric();

$('#culture').on('click', '.randomizeName', e => {
    generateName();
});
$('#culture').on('click', '.randomizeCulture', e => {
    let randCulture = getRandomInt(0, 9);
    let randSex = getRandomInt(0, 1);
    settings.culture = cultures[randCulture];
    settings.sex = sexes[randSex];
    generateName();
});