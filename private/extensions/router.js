// Module Start
// Router
// Module export
module.exports = function(m) {
  const express = m.express;
  const sass = require('node-sass');
  const app = m.app;
  const path = require('path');
  const expressSession = require('express-session');
  const MongoStore = require('connect-mongo')(expressSession);
  const store = new MongoStore({
    secret: 'blood-sand',
    mongooseConnection: m.mongoose.connection
  });
  const session = expressSession({
    secret: 'blood-sand',
    resave: false,
    saveUninitialized: true,
    store
  });
  store.on('create', function (...args) {
    console.log("mongo store :: create");
    console.log(args);
  });
  store.on('touch', function (...args) {
    console.log("mongo store :: touch");
    //console.log(args);
  });
  store.on('update', function (id) {
    console.log("mongo store :: update");
    
  });
  /*
  store.on('set', function (...args) {
    console.log("mongo store :: set");
    console.log(args);
  });
  */
  store.on('destroy', function (...args) {
    console.log("mongo store :: destroy");
    console.log(args);
  });

  const root = path.dirname(process.mainModule.filename);

  app.use(session);
  m.sessionStore = store;
  m.expressSession = session;

  console.log("express sess:", m.expressSession);

  app.get('/', function(req, res) {
    res.redirect('/' + m.config.defaults.index);
  });
  app.get(/gladiator\-(.*)/, function(req, res) {
    res.sendFile(path.join(root, 'src', 'index.html'));
  });
  app.get(/(.*)/, function(req, res) {
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

      filename += '/' + url_parts[i].replace(/[^\w\.\-]/, '');
    }

    const filepath = path.join(root, filename);

    if (m.fs.existsSync(filepath)) {
      if (m.fs.lstatSync(filepath).isDirectory()) {

        m.fs.readdir(filepath, function(err, dir) {
          if (err) {
            return res.send(err);
          }

          res.send(dir);
        });
      } else {
        res.sendFile(filepath);
      }
    } else if (path.extname(filepath) === '.css') {
      let sassPath = filepath.replace('.css', '.scss');

      sass.render({
        file: sassPath,
        sourceMap: true,
        sourceMapEmbed: true,
        outputStyle: 'compressed',
        outFile: filepath
      }, (err, result) => {
        if (err) {
          res.status(404).send('Cannot find it.');

          return;
        }
        res.setHeader('content-type', 'text/css');

        //console.log(result.css);

        res.send(result.css);
      });

      return;
    } else {
      res.status(404).send('Cannot find it.');
    }
  });
}
// Module End
