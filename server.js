var main = {
	express : require('express'),
	port: 8000, 
	fs: require('fs'), 
	config: require('./private/config.json')
};
main.app = main.express();
require('./private/init')(main);
console.log("Server started.");
