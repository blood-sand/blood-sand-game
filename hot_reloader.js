const process = require('process');
const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const open = require('open');
const kill = require('tree-kill');
const URL = "http://localhost:8080";
const NAME = "Server Auto-Reloading Environment for Blood & Sand";

let server = cp.fork('server.js');
let waiting = true;

console.log(`RUNNING: ${NAME}`);
function recurWatch(p) {
	console.log(`Watching: ${p}`);
	let dir = fs.readdirSync(p);
	for (let i = 0; i < dir.length; i += 1) {
		let file = dir[i];
		if (file[0] === "." || file === "node_modules") {
			continue;
		}
		let filepath = path.join(p, file);
		if (fs.lstatSync(filepath).isDirectory()) {
			recurWatch(filepath);
		}
	}
	fs.watch(p, function (event, filename) {
	    server.kill();
		console.log(`RELOADING: ${NAME}`);
		if (!waiting) {
			setTimeout(() => {
				server = cp.fork('server.js');
		    	waiting = false;
			}, 1500);
		}
		waiting = true;
	});
}

recurWatch('./');
process.on('SIGINT', function () {
	console.log(`KILLING: ${NAME}`);
    server.kill();
    fs.unwatchFile('server.js');
    process.exit();
});
waiting = false;
setTimeout(() => open("http://localhost:8080"), 1000);
