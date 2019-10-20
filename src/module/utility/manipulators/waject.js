// Waject
waject.extend('bindInput', function(
  prop,
  element,
  event = 'change',
  inHandler = (element, p, prop) => {
    p[prop] = $(element).val();
  },
  outHandler = (element, val) => {
    $(element).val(val);
  }) {
  if (typeof prop === "object") {
    element = prop.element;
    event = prop.event || event;
    inHandler = prop.inHandler || inHandler;
    outHandler = prop.outHandler || outHandler;
    prop = prop.property;
  }

  $(element).on(event, e =>
    inHandler(e.target, this.proxy, prop));

  this.proxy.on('set', prop, (result) =>
    outHandler(element, result.value));

  outHandler(element, this.target[prop]);
});
