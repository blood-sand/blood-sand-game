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
    * __/src/assets/__: Contains all the static assets;
    * __/src/assets/html__: Contains all the Front-End assets;
    * __/src/assets/img__: Contains all the iconographic assets;
    * __/src/config__: Contains all the game configurations;
    * __/src/css__: Contains all the Front-End styles;
    * __/src/sass__: Contains all the Front-End pre-processed styles;
    * __/src/sass/lib__: Contains all the Front-End third-party pre-processed styles;
    * __/src/scenes__: Contains all the game scene modules;

- Sources:
    * __/src/assets/html/\<seciton-name\>.html__: Custom DOM UI asset;
    * __/src/config/config.js__: Main game configuration module;
    * __/src/css/\<seciton-name\>.css__: Custom DOM UI asset style;
    * __/src/sass/index.scss__: Main custom DOM UI asset pre-processed style
        - Includes:
            - All the third-party pre-processed style libraries
                - Compass;
            - Basic pre-processed styles set-up;
            - Section specific pre-processed styles;
            - Browser Hacks pre-processed styles;
    * __/src/scenes/\<scene-name\>.js__: Game specific scene module
        - Includes:
             - __\<function-name\>__: Common proprietary and third-party modules import;
             - Scene definition;
    * __/src/index.js__: Main module
        - Includes:
            - __\<function-name\>__: Common proprietary and third-party modules import;
            - Game definition;
    * __/\_config.yml__: Repository theme configuration;
    * __/.babelrc__: ES6 compiler configuration;
    * __/.gitignore__: Repository configuration;
    * __/.jsbeautifyrc__: Code linter configuration;
    * __/CODE\_OF\_CONDUCT.md__: Repository Code of Conduct manifest;
    * __/config.rb__: SASS framework configuration;
    * __/CONTRIBUTING.md__: Repository contribution guidelines;
    * __/favicon.png__: Custom browser FavIcon;
    * __/index.html__: Main entry point document;
    * __/ISSUE\_TEMPLATE.md__: Repository template for issue publications;
    * __/LICENSE__: Project license;
    * __/package-lock.json__: Full-Stack Front-End dependencies archive;
    * __/package.json__: Full-Stack Front-End project and dependencies configuration;
    * __/README.md__: Repository information;
    * __/SECURITY.md__: Repository security policy;
    * __/webpack.base.js__: Module plugin bundler configuration script (Development);
    * __/webpack.prod.js__: Module plugin bundler configuration script (Production);


## Repository

- .gitignore (Development)
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
    # Cache
    .sass-cache
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

#### Public API

- _PhaserJS_ (>= 3.x.x);
- Project related third-party frameworks/libraries;

The releasing process follows the SemVer specification (https://semver.org/).
Please read about its guidelines before draft any release.


## Host

### Essential files^!

- __.ftpquota__
- __revisions.log__

^! __Not delete__
