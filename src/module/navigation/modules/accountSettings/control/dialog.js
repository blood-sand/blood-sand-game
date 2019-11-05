// Dialog
const self = this;
const dialog = self.state.dialog;

dialog.dialog({
  autoOpen: false,
  modal: true,
  width: 720,
  show: {
    effect: 'puff',
    duration: 250
  },
  hide: {
    effect: 'puff',
    duration: 250
  },
  beforeClose() {
    delete self.share.query.accountSettings;
  },
  close() {
    self.share.sounds.bow.play();
  },
  create() {
    self.share.eventLoop.when(() => (
      self.share.query.accountSettings === true &&
      !self.state.dialog.dialog('isOpen')
    ), () => {
      self.state.dialog.dialog('open');
    });
  },
  open() {
    self.share.query.accountSettings = true;

    self.share.sounds.switch.play();

    $('.ui-widget-overlay').one('click', () => $(this).dialog('close'));
  }
});

self.state.credentials.on("set", "email", result => {
  console.log("Email change");
  if (result.value.length === 0) {
    dialog.html(self.display.login);
    return;
  }
  dialog.html(self.display.list);
  dialog.find('.email').text(result.value);
});

dialog.on('submit', 'form', function (e) {
  e.preventDefault();
});