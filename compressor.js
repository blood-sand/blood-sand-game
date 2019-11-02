// Compressor
let Hookmod = require('hookmod');

let hm = new Hookmod('src/module');

hm.writeTo('src/js/compressedModules.js');
console.log("Modules compressed.");

require('./scriptCompressor.js');
