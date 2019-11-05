
const self = this;
let dialog = this.state.dialog;

dialog.on('change keyup', 'input', function (e) {

  this.setCustomValidity("");
  if(!this.checkValidity()) {
    console.log("not valid")
    dialog.find('button').click();
    return;
  }
  let name = $(this).attr('name');
  let lower = /[a-z]/;
  let upper = /[A-Z]/;
  let number = /[0-9]/;
  let special = /[^a-z0-9]/i;
  if (name === "password" || name === "shownPassword") {
    if (!$(this).is(':required')) {
      console.log("not required");
      this.setCustomValidity("");
      return;
    }
    console.log("required");
    if (!lower.test($(this).val())) {
      console.log("no lower-case in pw");
      this.setCustomValidity("Please include a lower-case letter.");
      dialog.find('button').click();
      return;
    }
    if (!upper.test($(this).val())) {
      console.log("no upper-case in pw");
      this.setCustomValidity("Please include an upper-case letter.");
      dialog.find('button').click();
      return;
    }
    if (!number.test($(this).val())) {
      console.log("no number in pw");
      this.setCustomValidity("Please include a number.");
      dialog.find('button').click();
      return;
    }
    if (!special.test($(this).val())) {
      console.log("no special char in pw");
      this.setCustomValidity("Please include a special character.");
      dialog.find('button').click();
      return;
    }
    this.setCustomValidity("");
  }
});

dialog.on('submit', 'form[action=login]', function (e) {
  e.preventDefault()
  let result = $(this).serializeObject();
  delete result.shownPassword;
  console.log(result);

  $(this).find('.save').prop('disabled', true);
  self.state.login(result);
});

dialog.on('focus', 'input', function (e) {
    $(this).removeClass('invalid');
});

dialog.on('click', '.reveal-pw', function (e) {
  $(this).toggleClass('fa-eye').toggleClass('fa-eye-slash');
  let pw = $(this).siblings('div:has(input)').children('input[name=password]');
  let shownPw = $(this).siblings('div:has(input)').children('input[name=shownPassword]');
  pw.toggle('slide', {
    direction: 'up',
    duration: 300,
    easing: 'easeInQuad'
  });
  shownPw.toggle('slide', {
    direction: 'down',
    duration: 300,
    easing: 'easeInQuad'
  });
  if ($(this).hasClass('fa-eye')) {
    pw.prop('required', false);
    shownPw.prop('required', true);
  } else {
    pw.prop('required', true);
    shownPw.prop('required', false);
  }
  pw[0].setCustomValidity('');
  shownPw[0].setCustomValidity('');

  pw.trigger('change');
  shownPw.trigger('change');
});

dialog.on('dialogbeforeclose', function (e) {
  let revealer = $(this).find('.reveal-pw');
  if (revealer.hasClass('fa-eye')) {
    revealer.trigger('click');
  }
});

dialog.on('change', 'input[name=password]', function (e) {
  $(this).siblings('input[name=shownPassword]').val($(this).val());
});
dialog.on('change', 'input[name=shownPassword]', function (e) {
  $(this).siblings('input[name=password]').val($(this).val());
});
