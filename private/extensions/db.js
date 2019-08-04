var db = require('mongojs')('blood-and-sand', []);
module.exports = function (m) {
	m.db = db;
};
