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
		let ready = false;
		let modules = [];
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
				let result = {};
				for (let i = 0; i < contents.length; i += 1) {
					let entry = contents[i];
					result[entry] = await load(`${path}/${entry}`);
				}
				return result;
			}
			return contents;
		}
		load('/module').then(r => {
			$('#game').append(r.culture.display['main.htm']);
			for (let filename in r.culture.control) {
				let func = r.culture.control[filename];
				func();
			}
		});
		/*
		$.get('/module', function (moduleDirs) {
			if (!(moduleDirs instanceof Array)) {
				return;
			}
			moduleDirs.forEach(moduleName => {

				modules[moduleName] = {};
				let dirname = `/module/${moduleName}`;
				$.get(dirname, md => {
					console.log(md);
					md.forEach(entry => {
						if (entry === "main.js") {
							$.ajax({
								url: `${dirname}/main.js`, 
								dataType: "text",
								success: main => {
									modules[moduleName].init = new Function(main);
								}
							});
						} else {
							modules[moduleName][entry] = {};
							$.get(`${dirname}/${entry}`, d => {
								d.forEach(f => {
									$.get(`${dirname}/${entry}/${f}`, contents => {
										modules[moduleName][entry][f] = contents;
										console.log(modules);
									})
								});

							});
						}
					});
				});
			});

		});
		*/

		class ModuleFactory {
			constructor() {
				priv.set(this, {
					// private properties
				});
			}



		}

		return ModuleFactory;
	}());
}