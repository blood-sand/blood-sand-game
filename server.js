var main = {
	express : require('express'),
	port: 8080, 
	fs: require('fs'), 
	config: require('./private/config.json'),
	root: __dirname
};
main.app = main.express();
require('./private/init')(main);
console.log("Server started.");
