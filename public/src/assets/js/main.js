var socket = io();
(function () {
    const MAX_ABILITY_SUM = 91;
    const MAX_STAT_SIZE = 25;
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
    let cultureInfo = {}

    socket.emit("gladiator-create-ready");

    socket.on("gladiator-culture-info", d => {
        cultureInfo = d;
        $('select[name="culture"]').trigger('change');
    });
    socket.on("gladiator-stats", d => {
        stats = d;
        for (let field in stats) {
            $(`input[name="${field}"]`).val(stats[field]);
        }
    });

    function randomProperty (obj, f = () => {}) {
        var keys = Object.keys(obj).filter(f);
        return  keys[keys.length * Math.random() << 0];
    };


    let culture = -1;
    $('#culture').on('change', e => {
        const pick = e.target.selectedIndex - 1;
        if (pick < 0) {
            e.target.selectedIndex = culture + 1;
            return;
        }
        $('p.cultureInfo').text(cultureInfo[$(e.target).val()]);
        culture = pick;
        console.log(culture);
    });
    $('.gladiatorData input').on('change', e => {
        let value = +e.target.value;
        let name = e.target.name;
        let abilitySum = stats.abilitySum;
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
                    randProp = randomProperty(stats, i => i !== "abilitySum" && stats[i] < MAX_STAT_SIZE);
                    console.log("rand prop:", randProp);
                    stats[randProp] += 1;
                    difference -= 1;
                } else {
                    randProp = randomProperty(stats, i => i !== "abilitySum" && stats[i] > 0);
                    console.log("rand prop:", randProp);
                    stats[randProp] -= 1;
                    difference += 1;
                }
                $(`input[name="${randProp}"]`).val(stats[randProp]);
            }
            $('input[name="abilitySum"]').val(stats.abilitySum);
            
            return;
        }
        if (value < 0) {
            value = 0;
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