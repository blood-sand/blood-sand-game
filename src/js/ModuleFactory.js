/**
 * A ModuleFactory helps you manage modules.
 * All of the modules are preloaded for quick rendering.
 *
 * example of usage:
 *
 * let culture = (ModuleFactory instance).fetch('culture');
 */
if (window) {
  window.ModuleFactory = (function() {
    const priv = new WeakMap();
    const dirExp = /\/([a-z]+)$/;
    const htmExp = /\/([a-z]+\.htm)$/;
    const jsExp = /\/([a-z]+\.js)$/;
    const cssExp = /\/([a-z]+\.css)$/;

    /**
     * @description Module getter
     * @author Luca Cattide
     * @date 2019-10-20
     * @param {*} path Module path
     * @returns
     */
    async function load(path) {
      let contents;

      if (dirExp.test(path)) {
        contents = await $.get(path);
      } else if (htmExp.test(path)) {
        contents = $(await $.ajax({
          url: path,
          dataType: 'text'
        }));
      } else if (jsExp.test(path)) {
        let fName = path.replace(/\/[^\/]*\//, "").replace(/\//g, "_").replace(/\.js$/, "");

        contents = new Function(`return function ${fName} () {\n\t` +
          (await $.ajax({
            url: path,
            dataType: 'text'
          })).replace(/\n/g, '\n\t') +
          "\n};")();
      } else if (cssExp.test(path)) {
        contents = (await $.ajax({
          url: path,
          dataType: 'text'
        }));
      }
      if (contents instanceof Array) {
        let pending = [];
        let labels = [];
        let resolved, result;

        for (let i = 0; i < contents.length; i += 1) {
          labels.push(contents[i].split('.')[0]);
          pending.push(load(`${path}/${contents[i]}`));
        }

        resolved = await Promise.all(pending);
        results = {};

        resolved.forEach((c, i) => {
          results[labels[i]] = c;
        });

        return results;
      }

      return contents;
    }

    /**
     * @description Module Factory Class
     * @author Luca Cattide
     * @date 2019-10-20
     * @class ModuleFactory
     */
    class ModuleFactory {
      /**
       * Creates an instance of ModuleFactory.
       * @author Luca Cattide
       * @date 2019-10-20
       * @param {string} [moduleDirectory='/module'] Module directory
       * @memberof ModuleFactory
       */
      constructor(moduleDirectory = '/module') {
        const self = this;
        let share = {};
        let modules = load(moduleDirectory);
        let loaded = [];

        priv.set(self, {
          modules: modules,
          modulesSync: {},
          prepareModule: function(module, name) {
            let main = module.main;

            if (!main) {
              main = function() {};
            }

            main.prototype = module;

            if (loaded.indexOf(name) === -1) {
              main.prototype.loaded = false;
              main.prototype.state = waject();
              main.prototype.share = share;

              loaded.push(name);

              for (let field in module) {
                let val = module[field];

                if (field === 'main') {
                  continue;
                }
                if (typeof val === 'object') {
                  for (let f2 in val) {
                    let v2 = val[f2];

                    if (typeof v2 === 'function') {
                      //console.log(f2);
                      //console.log(v2.bind(module));

                      module[field][f2] = v2.bind(main.prototype);
                    }
                  }
                }
              }
            } else {
              main.prototype.loaded = true;
            }

            let instance = new main();

            return instance;
          }
        });
        modules.then(r => {
          priv.get(self).modulesSync = r;
        });
      }

      /**
       * @description Module fetching
       * fetch(String moduleName):
         input: (string) the name of a module.
         return: a promise that resolves to a module 's
         directory, fully loaded and ready.
         If a module doesn 't exist, returns
         undefined.
       * @author Luca Cattide
       * @date 2019-10-20
       * @param {*} moduleName Module name
       * @returns
       * @memberof ModuleFactory
       */
      async fetch(moduleName) {
        const self = this;
        const p = priv.get(self);
        return p.prepareModule((await p.modules)[moduleName], moduleName);
      }

      /**
       * @description Module fetching syncronization
       * fetchSync(String moduleName):
         input: (string) the name of a module.
         return: a fully loaded module, if possible.
         if the module isn 't ready, or doesn't exist, returns undefined.
       * @author Luca Cattide
       * @date 2019-10-20
       * @param {*} moduleName Module name
       * @returns
       * @memberof ModuleFactory
       */
      fetchSync(moduleName) {
        const self = this;
        const p = priv.get(self);

        return p.prepareModule(priv.get(self).modulesSync[moduleName]);
      }

    }

    return ModuleFactory;
  }());
}
