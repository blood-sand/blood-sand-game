// Dialog
const self = this;

self.state.dialog.dialog({
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
    delete self.share.query.soundSettings;
  },
  close() {
    self.share.sounds.bow.play();
  },
  create() {
    self.share.eventLoop.when(() => (
      self.share.query.soundSettings === true &&
      !self.state.dialog.dialog('isOpen')
    ), () => {
      self.state.dialog.dialog('open');
    });
  },
  open() {
    self.share.query.soundSettings = true;

    self.share.sounds.switch.play();

    $('.ui-widget-overlay').one('click', () => $(this).dialog('close'));
  }
});
