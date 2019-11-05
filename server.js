// Server - Configuration
let events = require('events');
var main = {
  express: require('express'),
  port: 8081,
  fs: require('fs'),
  config: require('./private/config.json'),
  root: __dirname,
  event: new events.EventEmitter(),
  eventEmitter: events.EventEmitter
};

main.app = main.express();

require('./private/init')(main);

console.log('Server started.');
