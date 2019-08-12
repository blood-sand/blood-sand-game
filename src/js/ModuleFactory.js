/*
	A ModuleFactory helps you manage modules.
	All of the modules are preloaded for quick
	rendering. 
	
	example of usage:
	


	let culture = ModuleFactory.fetch('culture');



*/
if (window) {
	window.ModuleFactory = (function () {
		const priv = new WeakMap();
		const dirExp = /\/([a-z]+)$/;
		const htmExp = /\/([a-z]+\.htm)$/;
		const jsExp = /\/([a-z]+\.js)$/;

		async function load (path) {
			let contents;
			if (dirExp.test(path)) {
				contents = await $.get(path);
			} else if(htmExp.test(path)) {
				contents = $(await $.ajax({
					url: path,
					dataType: "text"
				}));
			} else if(jsExp.test(path)) {
				contents = new Function(await $.ajax({
					url: path,
					dataType: "text"
				}));
			}
			if (contents instanceof Array) {
				let pending = [];
				let labels = [];
				let resolved, result;
				for (let i = 0; i < contents.length; i += 1) {
					labels.push(contents[i]);
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
		/*
		load('/module').then(r => {
			$('#game').append(r.culture.display['main.htm']);
			for (let filename in r.culture.control) {
				let func = r.culture.control[filename];
				func();
			}
		});
		*/

		class ModuleFactory {
			constructor(moduleDirectory = '/module') {
				const self = this;
				let modules = load(moduleDirectory);

				priv.set(self, {
					modules: modules,
					modulesSync: {},
					prepareModule: function (module) {
						let main = module['main.js'];
						if (!main) {
							main = function () {};
						}
						main.prototype = module;
						return new main;
					}
				});

				modules.then(r => {
					priv.get(self).modulesSync = r;
				});
			}

			/* 
				fetch (String moduleName):
					input : (string) the name of a module.
					return: a promise that resolves to a module's
							directory, fully loaded and ready.
							If a module doesn't exist, returns
							undefined.
				
			*/
			async fetch (moduleName) {
				const self = this;
				const p = priv.get(self);
				return p.prepareModule((await p.modules)[moduleName]);
			}

			/*
				fetchSync (String moduleName):
					input : (string) the name of a module.
					return: a fully loaded module, if possible.
							if the module isn't ready, or doesn't
							exist, returns undefined.
			*/
			fetchSync (moduleName) {
				const self = this;
				const p = priv.get(self);
				return p.prepareModule(priv.get(self).modulesSync[moduleName]);
			}

		}

		return ModuleFactory;
	}());
}