// Module Start
// Event
// Module export
module.exports = function(m) {
  var events = require('events');

  m.eventEmitter = function() {
    return new events.EventEmitter();
  };
  m.event = m.eventEmitter();
};
// Module End
