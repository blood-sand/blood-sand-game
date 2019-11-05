// Module Start
// Database
const mongoose = require('mongoose');
let db;

mongoose.connect('mongodb://localhost/blood-sand', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

db = mongoose.connection;

mongoose.set('useFindAndModify', false);

// Module export
module.exports = function(m) {
  m.mongoose = mongoose;
  m.db = db;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log("Mongoose connected.");
    m.event.emit("mongoose-ready");
  });
};
