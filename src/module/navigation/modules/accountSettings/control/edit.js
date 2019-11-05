const self = this;
const dialog = self.state.dialog;

dialog.on('submit', 'form[action=edit]', function (e) {
  console.log("Edit...");
  dialog.html(self.display.modify);
  dialog.find('[name=email]').val(self.state.credentials.email);
});