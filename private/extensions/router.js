module.exports = function (m) {
	const express = m.express;
	const app = m.app;
	const path = require('path');
	const expressSession = require('express-session');
	const MongoStore = require('connect-mongo')(expressSession);
	const session = expressSession({
		secret: 'blood-sand',
		resave: true,
		saveUninitialized: true,
		store: new MongoStore({
			mongooseConnection: m.mongoose.connection
		})
	});
	const root = path.dirname(process.mainModule.filename);

	app.use(session);
	m.expressSession = session;
	app.get('/', function (req, res) {
		res.redirect('/' + m.config.defaults.index);
	});
	
	app.get(/(.*)/, function (req, res) {
		var filename = 'src';
		var url_parts = req.params[0].split('/').splice(1);
		var i;
		
		for (i in url_parts) {
			if (i == url_parts.length - 1) {
				for (var alias in m.config.defaults) {
					if (url_parts[i] === alias) {
						url_parts[i] = m.config.defaults[alias];
					}
				}
			}
			filename += '/' + url_parts[i].replace(/[^\w\.\-]/,'');
		}
		const filepath = path.join(root, filename);
		if (m.fs.existsSync(filepath)) {
			if (m.fs.lstatSync(filepath).isDirectory()) {
				m.fs.readdir(filepath, function (err, dir) {
					if (err) {
						return res.send(err);
					}
					res.send(dir);
				});
			} else {
				res.sendFile(filepath);
			}
		} else {
			res.status(404).send('Cannot find it.');
		}
	});
}
