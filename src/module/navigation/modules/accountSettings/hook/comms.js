const self = this;

self.state.credentials = waject({
  email: '',
  password: ''
});

self.state.login = function (credentials) {
  socket.emit('account-login', credentials);
}

self.state.modify = function (credentials) {
  socket.emit('account-modify', credentials);
}

socket.on('account-credentials', credentials => {
  if (credentials === null) {
    console.log('No credentials.')
  } else {
    console.log('credentials:', credentials);
    self.state.credentials['*'] = credentials;
  }

});

socket.on('account-credentials-error', error => {
  console.log('Account credentials error:', error);
  if (error === 'incorrect') {
    self.state.dialog.find('[name=password]')[0].setCustomValidity("Incorrect Password");
    self.state.dialog.find('.save').prop('disabled', false).trigger('click');
  }
});

socket.emit('account-settings-ready');