module.exports = function (m) {
	var dir = m.fs.readdirSync('./private/' + m.config.extensions.dir);
	console.log("Init Dir:", dir);
	var index;
	for (index in dir) {
		require('./' + m.config.extensions.dir + '/' + dir[index])(m);
	}
};
