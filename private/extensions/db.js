// Module Start
// Database
const mongoose = require('mongoose');
let db;

mongoose.connect('mongodb://localhost/blood-sand', {
  useNewUrlParser: true
});

db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Mongoose connected.");
});

// Module export
module.exports = function(m) {
  m.mongoose = mongoose;
  m.db = db;
};
