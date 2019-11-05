

module.exports = function(m, local) {
  let session = local.session;
  let socket = local.socket;
  let credentials = null
  function verifyPassword(password) {
    let lower = /[a-z]/;
    let upper = /[A-Z]/;
    let number = /[0-9]/;
    let special = /[^a-z0-9]/i;

    if (password.length < 8 || password.length > 32) {
      return 'length';
    }
    if (!lower.test(password)) {
      return 'lower';
    }
    if (!upper.test(password)) {
      return 'upper';
    }
    if (!number.test(password)) {
      return 'number';
    }
    if (!special.test(password)) {
      return 'special';
    }
    return true;
  }

  function verifyEmail(email) {
    // TODO: actually verify this somehow..
    return true;
  }

  async function verifyCredentials(credentials) {
    return {
      email: await verifyEmail(credentials.email),
      password: await verifyPassword(credentials.password)
    };
  }

  async function handleRegister(user) {
    if (verifyEmail(user.email) === true && verifyPassword(user.password) === true) {
      session.account.email = user.email;
      session.save();
      user.sessionId = session.id;
      await user.hashPassword();
      await user.save();
      socket.emit('account-credentials', session.account);
      console.log("account saved.");
    } else {
      console.log('Sending error result:', result);
      socket.emit('account-credentials-error', result);
    }
  }

  async function handleLogin(user, existing) {
    if (await existing.checkPassword(user.password)) {
      console.log("Pass Matches.");
      let existingSess = await m.sessionStore.get(existing.sessionId);
      console.log(existingSess);
      for (let label in existingSess) {
        session[label] = existingSess[label];
      }
      await session.save();
      console.log(session);
      socket.emit('eval', 'window.location.reload();');
    } else {
      console.log("Pass doesn't match.");
      socket.emit('account-credentials-error', 'incorrect');
    }
  }

  if (session.account === undefined) {
    console.log('Creating account sess entry.')
    session.account = {
      email: ''
    }
  }

  console.log('account-credentials', session.account);
  socket.emit('account-credentials', session.account);

  socket.on('account-login', async submission => {
    let user = new m.model.Account(submission);
    let existing = await user.existing();
    if (existing) {
      console.log("user exists");
      console.log(existing);
      return handleLogin(user, existing);
    }
    console.log("new user");
    return handleRegister(user);
  });
}