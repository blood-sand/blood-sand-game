# Best Practices

## Styles & Coding

- HTML, CSS and Javascript follow in general the Google Style Guide conventions (https://github.com/google/styleguide);
- Custom CSS follows the BEM convention (http://getbem.com/);

Please be sure to check and follow them before attempt any modification to the sources, in order to preserve the general integrity of the project patterns.
Third-party linter plugins like ESLint, Beautify, Prettier or any other similar resource are welcome (configuration files of the mentioned ones are already present).


## Assets

### Common Guidelines

- For assets inclusion location, specifications or their variations, please refeer to __TODO__ comments inside the sources;


### List of common assets

- Paths:
    * __/src/__: Contains all the game scripts;
    * __/src/assets/__: Contains all the iconographic/multimedia assets;
    * __/webpack/__: Contains all the module plugin bundle configurations;

- Sources:
    * __/src/index.js__: Main module
        - Includes:
            - __\<function-name\>__: Common proprietary and third-party modules import;
    * __/webpack/base.js__: Module plugin bundler configuration script (Development);
    * __/webpack/prod.js__: Module plugin bundler configuration script (Production);
    * __/index.html__: Main entry point document;


## Repository

- .gitignore
	* __Thumbs.db:__ OS multimedia thumbnail indexing file;
	* __.DS_Store__: OS filesystem indexing file (_Mac OS X_);
	* __.idea:__ IDE configuration file (_Intellij_);
	* __*.suo:__ IDE configuration file (_Visual Studio_);;
	* __*.sublime-project:__ IDE configuration file (_Sublime Text_);
	* __*.sublime-workspace:__ IDE configuration file (_Sublime Text_);
	* __.editorconfig:__ IDE configuration file (_VS Code_);
	* __.vscode:__ IDE configuration file (_VS Code_);
	* __/node_modules/:__ Full-Stack Front-End dependencies (_NodeJS_);
	* __dist/:__ Distribution files;
	* __/npm-debug.log:__ Operative registry (_NodeJS_);


I.e.

```
    # Repository - Configuration
    # System and IDE files
    Thumbs.db
    .DS_Store
    .idea
    *.suo
    *.sublime-project
    *.sublime-workspace
    .editorconfig
    .vscode
    # Vendors
    node_modules/
    # Build
    dist/
    /npm-debug.log
```


### Branches

There are three branches, defined as:

- __develop__ (Development);
- __staging__ (Beta);
- __master__ (Production - _Default_);

Contributions implement the GitFlow framework (https://tinyurl.com/zt4vys8).
Please read about its specifications before commit on any branch.

### Commits

- __< Label/Title >: < Description >__;

- __Label__: Implementation subject identification label (if expected);
- __Title__: Short unique naming of the implementation subject
- __Description__: Short descriptive note of the implementation done;

I.e.

```
	Update: Icons updated;
```


### Merges

- __staging__: merging from __develop__;
- __master__: merging from __staging__;


### Releases

The releasing process follows the SemVer specification (https://semver.org/).
Please read about its guidelines before draft any release.


## Host

### Essential files^!

- __.ftpquota__
- __revisions.log__

^! __Not delete__
