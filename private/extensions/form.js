// Module Start
// Form
var bcrypt = require('bcrypt');

//console.log(bcrypt.genSaltSync(7, 10));

var form = {
  process: function(expected, data) {
    var key;
    var i = 0;
    var result = {};

    for (key in expected) {
      if (!(data[i].name in expected) ||
        data[i].value.match(expected[key]) === null
      ) {
        console.log(key, data[i],
          !(data[i].name in expected),
          data[i].value.match(expected[key])
        );

        throw 'Incompatible Input';
      }

      result[data[i].name] = data[i].value;
      i += 1;
    }
    return result;
  },
  hash: function(str) {
    return bcrypt.hashSync(str, 10);
  },
  compare: function(pass, hash) {
    return bcrypt.compareSync(pass, hash);
  }
};

// Module export
module.exports = function(m) {
  m.form = form;
};
// Module End
