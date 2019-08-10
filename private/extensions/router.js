module.exports = function (m) {
	const express = m.express;
	const app = m.app;
	const path = require('path');
	const root = path.dirname(process.mainModule.filename);
	//console.log(path, root);
	app.get('/', function (req, res) {
		res.redirect('/' + m.config.defaults.index);
	});
	
	app.get(/(.*)/, function (req, res) {
		var filename = 'src';
		var url_parts = req.params[0].split('/').splice(1);
		var i;
		console.log(url_parts);
		//res.send(url_parts);
		
		for (i in url_parts) {
			//console.log(i, url_parts.length - 1);
			if (i == url_parts.length - 1) {
				//console.log("Checking for alias...");
				for (var alias in m.config.defaults) {
					if (url_parts[i] === alias) {
						//console.log("Found alias:", url_parts[i])
						url_parts[i] = m.config.defaults[alias];
					}
				}
			}
			filename += '/' + url_parts[i].replace(/[^\w\.\-\_]/,'');
		}
		
		//var alternative = filename.substr(7) + '/' + m.config.defaults.index;
		console.log(root, filename);
		const filepath = path.join(root, filename);
		//console.log(filepath)
		if (m.fs.existsSync(filepath)) {
			if (m.fs.lstatSync(filepath).isDirectory()) {
				m.fs.readdir(filepath, function (err, dir) {
					if (err) {
						return res.send(err);
					}
					res.send(dir);
					console.log("sent dir", dir);
				});
			} else {
				res.sendFile(filepath);
				console.log("sent file:", filepath);
			}
			
		} else {
			res.status(404).send('Cannot find it.');
			console.log("sent 404 for:", filepath)
		}
	});
}
