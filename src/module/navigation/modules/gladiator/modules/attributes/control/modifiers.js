// Modifiers
const self = this;
const modifiers = self.state.modifiers;

$('#attributes ul>li .slider').each(function() {
  let name = $(this).attr('name');
  let fieldTooltip = '';
  let slider = $(`#attributes [name=${name}`);

  if (name in modifiers.final) {
    slider.siblings('.final').text(modifiers.final[name]);
  }
  if (name in modifiers.age) {
    if (modifiers.age[name] > 0) {
      fieldTooltip += '+'
    }

    fieldTooltip += `${modifiers.age[name]} from age, `;
  }
  if (name in modifiers.bmi) {
    if (modifiers.bmi[name] > 0) {
      fieldTooltip += '+'
    }

    fieldTooltip += `${modifiers.bmi[name]} from BMI, `;
  }
  if (name in modifiers.sex) {
    if (modifiers.sex[name] > 0) {
      fieldTooltip += '+'
    }

    fieldTooltip += `${modifiers.sex[name]} from sex, `;
  }

  fieldTooltip = fieldTooltip.substr(0, fieldTooltip.length - 2);

  if (fieldTooltip.length > 0) {
    fieldTooltip += '.';
  }

  slider.parent('li').attr('title', fieldTooltip);
});
