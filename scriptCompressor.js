let UglifyJS = require('uglify-es');
let fs = require('fs');
let path = require('path');
let dir = 'src/js/';
let out = 'src/o.js';

let scripts = [
	'howler.min.js',
	'jquery-3.4.1.min.js',
	'jquery-ui.min.js',
	'jquery.selectric.js',
	'jquery-ui-touch-punch.min.js',
	'waject.js',
	'compressedModules.js',
	'main.js'
];

let code = {};

scripts.forEach(filename => {
	code[filename] = fs.readFileSync(path.join(dir, filename), 'utf8');
});

let result = UglifyJS.minify(code, {
	compress: {
		//drop_console: true
	},
	/*
	sourceMap: {
		url: "inline"
	}
	*/
});

//console.log(result);

fs.writeFileSync(out, result.code);
console.log("JavaScript Compressed.");