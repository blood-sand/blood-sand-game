let path = require('path');
let fs = require('fs');

module.exports = function (m) {
  m.model = {};
  let modelPath = path.join(m.root, 'private/models');
  let models = fs.readdirSync(modelPath).
    map(filename => require(
      path.join(modelPath, filename)));
  m.event.on(
    "mongoose-ready", 
    () => models.forEach(fn => fn(m)));
}