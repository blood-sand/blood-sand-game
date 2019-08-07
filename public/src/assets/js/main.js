var socket = io();
(function hotReload() {
    let reloadOnConnect = false;
    socket.on("disconnect", function () {
        reloadOnConnect = true;
    });

    socket.on("connect", function () {
        if (reloadOnConnect) {
            window.location.reload();
        }
    });
}());

(function createGladiator () {
    const MAX_ABILITY_SUM = 91;
    const MAX_STAT_SIZE = 18;
    const MIN_STAT_SIZE = 3
    let stats = {
        strength: 0,
        dexterity: 0,
        perception: 0,
        endurance: 0,
        intelligence: 0,
        willpower: 0,
        vitality: 0,
        abilitySum: 0
    };
    let biometrics = {
        rank: 1,
        age: 0,
        weight: 0,
        height: 0,
        bmi: 0,
        reach: 0
    };
    let cultureInfo = {};
    let combatStats = {};
    let bmiMods = {};
    let gladiatorNames = {};
    let sexes = {
        male: 0,
        female: 1
    };
    let sex = $('#sex').val();

    function displayStats () {
        
        for (let field in stats) {
            let stat = stats[field];
            let e = $(`input[name="${field}"]`);
            e.val(stat);
        }
    }

    socket.emit("gladiator-create-ready");
    socket.on("gladiator-names", d => {
        console.log(d);
        gladiatorNames = d;
    });
    socket.on("gladiator-culture-info", d => {
        cultureInfo = d;
        $('select[name="culture"]').trigger('change');
    });
    socket.on("gladiator-stats", d => {
        stats = d;
        displayStats();
    });

    socket.on("gladiator-biometrics", d => {
        biometrics = d;
        for (let field in biometrics) {
            $(`input[name="${field}"]`).val(biometrics[field]);
        }
    });

    socket.on("gladiator-combat-stats", d => {
        combatStats = d;
        for (let field in combatStats) {
            $(`input[name="${field}"]`).val(combatStats[field]);
        }
    });

    socket.on("gladiator-bmi-mod", d => {
        bmiMods = d;
        $('.bmiMod').remove();
        console.log("bmiMods:", bmiMods);
        for (let field in bmiMods) {
            let mod = "" + bmiMods[field];
            if (mod[0] !== '-') {
                mod = '+' + mod;
            }
            console.log(field, mod);
            $(`<span class="bmiMod">${mod}</span>`).insertBefore(`input[name="${field}"]`)
        }
    });

    function randomProperty (obj, f = () => {}) {
        var keys = Object.keys(obj).filter(f);
        return  keys[keys.length * Math.random() << 0];
    };

    function generateName () {
        let cultureLabel = $('#culture').val().toLowerCase();
        let sex = $('#sex').val().toLowerCase();
        if (cultureLabel === "culture") {
            return;
        }
        let ref = gladiatorNames[cultureLabel][sex]
        let randName = ref[Math.floor(Math.random()*ref.length)];
        $('input[name="name"]').val(randName);
    }

    let culture = -1;
    $('#culture').on('change', e => {
        const pick = e.target.selectedIndex - 1;
        if (pick < 0) {
            e.target.selectedIndex = culture + 1;
            return;
        }        $('p.cultureInfo').text(cultureInfo[$(e.target).val()]);
        generateName();
        culture = pick;
        socket.emit("gladiator-culture", culture);
    });
    $('#sex').on('change', e => {
        sex = $(e.target).val().toLowerCase();
        generateName();
        socket.emit("gladiator-sex", sexes[sex]);
    })
    $('.gladiatorData input').on('change', e => {
        let value = +e.target.value;
        let name = e.target.name;
        let abilitySum = stats.abilitySum;
        if (name in bmiMods) {
            value -= bmiMods[name];
        }
        if (name === "abilitySum") {
            console.log("abilitySum", value)
            if (value > MAX_ABILITY_SUM) {
                value = MAX_ABILITY_SUM;
            }
            if (value < 0) {
                value = 0;
            }
            let difference = value - stats.abilitySum;
            console.log(difference);
            stats.abilitySum = value;
            if (isNaN(difference)) {
                return false;
            }
            while (difference !== 0) {
                let randProp;
                if (difference > 0) {
                    randProp = randomProperty(stats, i => {
                        if (i === "abilitySum") {
                            return false;
                        }
                        if (stats[i] >= MAX_STAT_SIZE) {
                            console.log("bad stat:", stats[i]);
                            return false;
                        }
                        console.log("good stat:", stats[i], MAX_STAT_SIZE);
                        return true;
                    });
                    console.log("rand prop:", randProp);

                    stats[randProp] += 1;
                    difference -= 1;
                } else {
                    randProp = randomProperty(stats, i => {
                        if (i === "abilitySum") {
                            return false;
                        }
                        if (stats[i] <= MIN_STAT_SIZE) {
                            console.log("bad stat:", stats[i]);
                            return false;
                        }
                        console.log("good stat:", stats[i], MAX_STAT_SIZE);
                        return true;
                    });
                    console.log("rand prop:", randProp);
                    stats[randProp] -= 1;
                    difference += 1;
                }
                $(`input[name="${randProp}"]`).val(stats[randProp]);
            }
            $('input[name="abilitySum"]').val(stats.abilitySum);
            
            return;
        }
        if (value < MIN_STAT_SIZE) {
            value = MIN_STAT_SIZE;
        } 

        if (value > MAX_STAT_SIZE) {
            value = MAX_STAT_SIZE;
        }
        
        let difference = value - stats[name];
        
        abilitySum += difference;
        console.log(value, difference, abilitySum);
        if (abilitySum > MAX_ABILITY_SUM) {
            let overDiff = abilitySum - MAX_ABILITY_SUM;
            abilitySum = MAX_ABILITY_SUM;
            stats[name] = value - overDiff;

        } else {
            stats[name] += difference;
        }
        stats.abilitySum = abilitySum;
        $(`input[name="${name}"]`).val(stats[name]);
        $('input[name="abilitySum"]').val(abilitySum);
    });
}());