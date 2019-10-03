const MAIN_DIR = 'src/module'
const OUT_FILE = 'src/js/compressedModules.js';
let path = require('path');
let fs = require('fs');


function importModules(MAIN_DIR) {
    let moduleString = `this.modules = {
        share: {},
        fetch: function (name) {
            let m = new modules[name];
            modules[name].prototype.loaded = true;
            return m;
        }
    };\n`;
    let subModules = "";
    let mainDir = fs.readdirSync(MAIN_DIR);
    mainDir.forEach(moduleName => {
        const MODULE_DIR = path.join(MAIN_DIR, moduleName);
        let moduleDir = fs.readdirSync(MODULE_DIR);
        console.log("module dir:", moduleDir);
        // Hopefully get the main.js file out.
        // (It works every time, 60% of the time. ;)
        let main = "main.js";
        let mainIndex = moduleDir.indexOf(main);
        moduleDir.splice(mainIndex, 1);

        console.log(moduleDir);
        console.log(main);
        //let main = moduleDir.pop();
        let mainContents = fs.readFileSync(path.join(MODULE_DIR, main), 'utf8');
        let prefab = "";
        function handleJS (moduleDir, filePath) {
            let prop = filePath.replace(moduleDir, '').
                replace(/\.js/, '').
                replace(/\//g, '.');
            //console.log(propName, filePath);
            return `modules.${moduleName}.prototype${prop}=function() {
        ${fs.readFileSync(filePath, 'utf8').replace(/\n/g, '\n\t')}
    };
    modules.${moduleName}.prototype${prop}.prototype = modules.${moduleName}.prototype;\n`;
        }

        function handleHTM (moduleDir, filePath) {
            let prop = filePath.replace(moduleDir, '').
                replace(/\.htm/, '').
                replace(/\//g, '.');
            return `modules.${moduleName}.prototype${prop}=$("${
                fs.readFileSync(filePath, 'utf8').
                    replace(/\s+/g, ' ').
                    replace(/\"/g, "\\\"")
            }");\n`;
        }

        function handleCSS (moduleDir, filePath) {
            let prop = filePath.replace(moduleDir, '').
                replace(/\.css/, '').
                replace(/\//g, '.');
            return `modules.${moduleName}.prototype${prop}="${
                fs.readFileSync(filePath, 'utf8').
                    replace(/\s+/g, ' ').
                    replace(/\"/g, "\\\"")
            }";\n`;
        }
        moduleDir.forEach(subDirName => {
            const SUB_DIR = path.join(MODULE_DIR, subDirName);
            if (subDirName === "modules") {
                console.log("subDirName:", subDirName);
                subModules += importModules(SUB_DIR);
                return;
            }

            prefab += `modules.${moduleName}.prototype.${subDirName}={};\n`;
            //console.log(SUB_DIR);
            subDir = fs.readdirSync(SUB_DIR);

            subDir.forEach(fileName => {
                const FILE = path.join(SUB_DIR, fileName);
                let ext = path.extname(FILE);
                //console.log(FILE, ext);
                switch (ext) {
                    case ".js": 
                        prefab += handleJS(MODULE_DIR, FILE);
                        break;
                    case ".htm":
                        prefab += handleHTM(MODULE_DIR, FILE);
                        break;
                    case ".css":
                        prefab += handleCSS(MODULE_DIR, FILE);
                        break;
                }
                    
                let contents = fs.readFileSync(FILE);
                //console.log(contents);
            });
        });
        mainContents = `modules.${moduleName} = function () {
        ${subModules}
        ${
            mainContents.replace(/\n/g, '\n\t')
        }
    };
    modules.${moduleName}.prototype.state = waject();
    modules.${moduleName}.prototype.share = modules.share;
    modules.${moduleName}.prototype.loaded = false;
    `;
        mainContents += prefab;
        moduleString += mainContents;
    });
    return moduleString;
}
/*
mainDir.forEach(moduleName => {
    const MODULE_DIR = path.join(MAIN_DIR, moduleName);
    let moduleDir = fs.readdirSync(MODULE_DIR);

    // Hopefully get the main.js file out.
    // (It works every time, 60% of the time. ;)
    let main = moduleDir.pop();
    let mainContents = fs.readFileSync(path.join(MODULE_DIR, main), 'utf8');
    let prefab = "";
    function handleJS (moduleDir, filePath) {
        let prop = filePath.replace(moduleDir, '').
            replace(/\.js/, '').
            replace(/\//g, '.');
        //console.log(propName, filePath);
        return `modules.${moduleName}.prototype${prop}=function() {
    ${fs.readFileSync(filePath, 'utf8').replace(/\n/g, '\n\t')}
};
modules.${moduleName}.prototype${prop}.prototype = modules.${moduleName}.prototype;\n`;
    }

    function handleHTM (moduleDir, filePath) {
        let prop = filePath.replace(moduleDir, '').
            replace(/\.htm/, '').
            replace(/\//g, '.');
        return `modules.${moduleName}.prototype${prop}=$("${
            fs.readFileSync(filePath, 'utf8').
                replace(/\s+/g, ' ').
                replace(/\"/g, "\\\"")
        }");\n`;
    }

    function handleCSS (moduleDir, filePath) {
        let prop = filePath.replace(moduleDir, '').
            replace(/\.css/, '').
            replace(/\//g, '.');
        return `modules.${moduleName}.prototype${prop}="${
            fs.readFileSync(filePath, 'utf8').
                replace(/\s+/g, ' ').
                replace(/\"/g, "\\\"")
        }";\n`;
    }
    moduleDir.forEach(subDirName => {
        const SUB_DIR = path.join(MODULE_DIR, subDirName);
        prefab += `modules.${moduleName}.prototype.${subDirName}={};\n`;
        //console.log(SUB_DIR);
        subDir = fs.readdirSync(SUB_DIR);
        subDir.forEach(fileName => {
            const FILE = path.join(SUB_DIR, fileName);
            let ext = path.extname(FILE);
            //console.log(FILE, ext);
            switch (ext) {
                case ".js": 
                    prefab += handleJS(MODULE_DIR, FILE);
                    break;
                case ".htm":
                    prefab += handleHTM(MODULE_DIR, FILE);
                    break;
                case ".css":
                    prefab += handleCSS(MODULE_DIR, FILE);
                    break;
            }
                
            let contents = fs.readFileSync(FILE);
            //console.log(contents);
        });
    });
    mainContents = `modules.${moduleName} = function () {
    ${
        mainContents.replace(/\n/g, '\n\t')
    }
};
modules.${moduleName}.prototype.state = waject();
modules.${moduleName}.prototype.share = modules.share;
modules.${moduleName}.prototype.loaded = false;
`;
    mainContents += prefab;
    moduleString += mainContents;
});
*/
fs.writeFileSync(OUT_FILE, importModules(MAIN_DIR));
console.log('Modules Compressed.');