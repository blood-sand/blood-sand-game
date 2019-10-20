// Events
const self = this;
const eventLoop = self.share.eventLoop;
const attributes = self.state.attributes;
const modifiers = self.state.modifiers;
let cultureSettings;

function updateSliders() {
  Object.keys(attributes).forEach(prop => {
    if (prop === 'serverSettings') {
      return;
    }

    $(`#attributes [name=${prop}]`).
    slider('value', attributes[prop]).
    children('.custom-handle').
    text(attributes[prop]);
  });
}

eventLoop.after(() => (
  !cultureSettings &&
  (cultureSettings = self.share.cultureSettings)
), () => {
  cultureSettings.bindInput('name',
    $('#attributes [name=name]')
  );
});

$('#attributes .slider').slider({
  create: function() {
    $(this).children('.custom-handle').text($(this).slider('value'));
  },
  slide: function(event, ui) {
    let name = $(this).attr('name');

    if (ui.value > attributes[name]) {
      let diff = ui.value - attributes[name];

      if ((attributes.abilitySum + diff) > 91) {
        return false;
      }
    }

    $(this).children('.custom-handle').text(ui.value);
  },
  min: 3,
  max: 18,
  animate: 'slow'
});
$('#attributes [name=abilitySum]').
slider('option', 'max', 91).
slider('option', 'min', 21);
$('#attributes .randomizeAttributes').on('click', e => {
  let sum = attributes.abilitySum;

  self.state.ignoreUpdate = true;
  attributes.abilitySum = 21;
  self.state.ignoreUpdate = false;
  attributes.abilitySum = sum;

  updateSliders();
});
$('#attributes ul>li .slider').each(function() {
  let name = $(this).attr('name');

  attributes.bindInput({
    property: name,
    element: $(this),
    event: 'slidestop',
    outHandler(element, value) {
      $(element).
      slider('value', value).
      children('.custom-handle').
      text(value);
    },
    inHandler(element, proxy, prop) {
      proxy[prop] = $(element).slider('value');

      return updateSliders();
    }
  });
});
