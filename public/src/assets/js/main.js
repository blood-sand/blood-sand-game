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
  let cultureInfo = {
    Roman: "The culture of ancient Rome existed throughout the almost 1200-year history of the civilization of Ancient Rome. The term refers to the culture of the Roman Republic, later the Roman Empire, which at its peak covered an area from Lowland Scotland and Morocco to the Euphrates.",
    Gallic: "Gaul was divided by Roman administration into three provinces, which were sub-divided in the later third century reorganization under Diocletian, and divided between two dioceses, Galliae and Viennensis, under the Praetorian prefecture of Galliae. On the local level, it was composed of civitates which preserved, broadly speaking, the boundaries of the formerly independent Gaulish tribes, which had been organised in large part on village structures that retained some features in the Roman civic formulas that overlaid them.\n\nOver the course of the Roman period, an ever-increasing proportion of Gauls gained Roman citizenship. In 212 the Constitutio Antoniniana extended citizenship to all free-born men in the Roman Empire.",
    Germanic: "info about Germanics...",
    Syrian: "info about Syrians...",
    Numidian: "info about Numidians...",
    Thracian: "info about Thracians...",
    Greek: "info about Greeks...",
    Iberian: "info about Iberians...",
    Judean: "info about Judeans...",
    Scythian: "info about Scythians...",
  }

  let attributeGenerator = {
    "strength": "rand(1,6)+rand(1,6)+rand(1,6)",
    "dexterity": "rand(1,6)+rand(1,6)+rand(1,6)",
    "perception": "rand(1,6)+rand(1,6)+rand(1,6)",
    "endurance": "rand(1,6)+rand(1,6)+rand(1,6)",
    "intelligence": "rand(1,6)+rand(1,6)+rand(1,6)",
    "willpower": "rand(1,6)+rand(1,6)+rand(1,6)",
    "vitality": "rand(1,6)+rand(1,6)+rand(1,6)",
    "abilitySum": "strength+dexterity+perception+endurance+intelligence+willpower+vitality"
  };
  function generateStats () {
    stats = jsonSL(attributeGenerator);
    for (let field in stats) {
      $(`input[name="${field}"]`).val(stats[field]);
    }
  }
  function randomProperty (obj, f = () => {}) {
    var keys = Object.keys(obj).filter(f);
    return  keys[keys.length * Math.random() << 0];
  };
  generateStats();
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