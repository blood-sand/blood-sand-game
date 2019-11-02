// HOT reloader
const process = require('process');
const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const open = require('open');
const kill = require('tree-kill');
const URL = 'http://localhost:8081';
const NAME = 'Server Auto-Reloading Environment for Blood & Sand';

require('./compressor.js');

let server = cp.fork('server.js');
let waiting = true;

console.log(`RUNNING: ${NAME}`);

function recurWatch(p) {
  let dir = fs.readdirSync(p);

  for (let i = 0; i < dir.length; i += 1) {
    let file = dir[i];

    if (file[0] === '.' ||
      file === 'node_modules' ||
      file === 'o.js' ||
      file === 'compressedModules.js') {
      console.log(`Skipping ${path.join(p, file)}`)

      continue;
    }

    let filepath = path.join(p, file);

    console.log(`Watching ${filepath}`);

    if (fs.lstatSync(filepath).isDirectory()) {
      recurWatch(filepath);
    }
  }

  fs.watch(p, function(event, filename) {
    if (filename[0] === '.' ||
      filename === 'node_modules' ||
      filename === 'o.js' ||
      filename === 'compressedModules.js') {
      return;
    }
    if (!waiting) {
      server.kill();

      console.log(p)
      console.log(`${filename} changed:: RELOADING: ${NAME}`);

      delete require.cache[require.resolve('./compressor.js')];
      delete require.cache[require.resolve('hookmod')];
      delete require.cache[require.resolve('./scriptCompressor.js')];

      require('./compressor.js');
      setTimeout(() => {
        server = cp.fork('server.js');
        waiting = false;
      }, 1500);
    }

    waiting = true;
  });
}

recurWatch('./');

process.on('SIGINT', function() {
  console.log(`KILLING: ${NAME}`);

  server.kill();
  fs.unwatchFile('server.js');

  process.exit();
});

waiting = false;

setTimeout(() => open(URL), 1000);
