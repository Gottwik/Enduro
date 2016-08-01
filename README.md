# Enduro

[![npm version](https://badge.fury.io/js/enduro.svg)](https://badge.fury.io/js/enduro)
[![npm](https://img.shields.io/npm/dm/enduro.svg?maxAge=2592000)]()
[![Build Status](https://travis-ci.org/kiskadigitalmedia/Enduro.svg?branch=master)](https://travis-ci.org/kiskadigitalmedia/Enduro)
[![Coverage Status](https://coveralls.io/repos/github/kiskadigitalmedia/Enduro/badge.svg?branch=master)](https://coveralls.io/github/kiskadigitalmedia/Enduro?branch=master)
[![Code Climate](https://codeclimate.com/github/kiskadigitalmedia/Enduro/badges/gpa.svg)](https://codeclimate.com/github/kiskadigitalmedia/Enduro)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/kiskadigitalmedia/Enduro/master/License.md)


Enduro is minimalistic, lean & mean, node.js cms. See more at [enduro.js website](https://kiskadigitalmedia.github.io/Enduro/)

## What's Enduro
Enduro is a complete platform for building websites with focus on productivity. In simpler terms you can build a website with Enduro really fast.

![enduro admin](http://i.imgur.com/hWBXcCF.png)

## Getting started

![enduro create](http://i.imgur.com/DtxhA7z.gif)

1. Make sure you have node.js installed. Grab it here if you don't: [nodejs installer](https://nodejs.org/en/download/).
1. Run `npm install enduro -g` in your terminal. This will install enduro.
1. Run `enduro create myproject`. This will create new folder /myproject with the enduro project
1. Go in the newly created folder by running `cd myproject`.
1. Start enduro in development mode by running simply `enduro`. Browser window should open with the website running.
1. Done!
2. Also, **Admin** interface is accessible at `localhost:5000`. Add admin user by running `enduro addadmin username password`.

## Enduro cli

To access cli tools, you need to install enduro globally: `npm install enduro -g`

 * `enduro` - Starts enduro for development
 * `enduro create projectname`  - Creates new folder /projectname with neccessary scaffolding
 * `enduro start` - Starts enduro on server - Without build tools such as watching
 * `enduro build` - Runs requirejs optimization on assets/js/main.js. To have more requirejs config files use `enduro build dev` which will search for main_dev.js config file
 * `enduro secure passphrase` - Adds simple, one-passphrase security to your website. Useful in development phase to protect the website against web crawlers.
 * `enduro check` - Runs the built html sites agains w3 validator and performs several other checks such as scss lint.
 * `enduro addadmin username password` - Adds credentials that work with admin interface. There are no default credentials.
 * `enduro addculture en de` - Adds cultures/languages. This will generate two files out of every page. These pages are accessible at `/en/pagename` and `/de/pagename`

 ### Flags
* `-f` will ignore warnings and force action
* `-nr` no refresh flag. Basically will not open new tab.
* `-noadmin` will not start admin interface.
* `-nojswatch` will not trigger browsersync refresh on js file changes
* `-nocmswatch` will not trigger browsersync refresh on cms file changes


## Project directory structure

Enduro will generate this scaffolding automatically by running `enduro create projectname`

```

├── project/
│   ├── _src // Production files go here
│   ├── assets
│   │   ├── css
│   │   │   ├── main.scss // sass proccesses this file only
│   │   ├── fonts
│   │   ├── img
│   │   ├── js
│   │   ├── spriteicons // sprite will be produced out of .png images inside this folder
│   │   ├── fonticons // icon font will be produced out of .svg images inside this folder
│   │   ├── hbs_helpers // custom handlebars helpers. Ready to use both in backend and frontend
│   │   ├── vendor
│   ├── cms
│   │   ├── config // stores enduro configuration files
│   │   ├── global
│   │   │   ├── global.js // all files in global directory are accessible to all pages
│   │   ├── index.js // data file is included in index.hbs file
│   ├── components
│   │   ├── button.hbs // partial that can be included by {{> button}}
│   ├── pages
│   │   ├── index.hbs // Generated page

```

## Usage

Enduro uses handlebars.

### Using components

```hbs
<!-- components/button.hbs -->
<input type="button" value="button" class="{{button_class}}">
```

```hbs
<!-- page/index.hbs -->
<p>press this button to do something</p>
{{>button button_class='red'}}
```

Will generate
```html
<!-- _src/index.html -->
<p>press this button to do something</p>
<input type="button" value="button" class="red">
```

### Using associated context files
```hbs
<!-- pages/somepage.hbs -->
<p>{{person}} came and said {{said_what}}</p>
```

```javascript
// cms/somepage.js
{
	person: "Big guy",
    said_what: "here's your pizza",
}
```

Will generate
```html
<!-- _src/somepage.html -->
<p>Big guy came and said here's your pizza</p>
```


## Built in helpers
* `{{partial 'partialname'}}` - renders partial based on string name. This helper is used for displaying helper dynamically
* `{{default class 'red'}}` - If no class parameter is provided 'red' is being used
* `{{#times 10}}` - will repeat anything inside 10 times. Don't forget to close `{{/times}}`
* `{{#json 'path/to/json.json}}` - will fetch a json array and iterate the hbs content with the context from the json `{{/json}}`
* `{{#list 'a' 'b' 'c'}}` - same as each with arguments as context `{{/list}}`
* `{{ternary condition 'output if true' 'output if false'}}` - ternary function implemented as hbs helper
* `{{#within global/products context.productid}}` - Changes context of the block inside for array's descendant with provided key
* `{{first array}}` - same as with but will provide first object in array as context
* `{{lorem 20}}` - will generate dummy text with a lenght of 20 words. If two arguments are supplied, it will generate a string with random length based on the range made out of the two arguments.
* `{{compare var1 var2 'true' 'false'}}` - will compare two variables and pick 'true' or 'false' in a ternary-like fashion
* `{{grouped_each 3 list}}` - Same as each, but will provide three items as context in each iteration
* `{{htmlescape 'www.example.com?p=escape spaces here'}}` - Self explanatory. Encodes given string to uri
* `{{files 'assets/js'}}` - Globs the files and iterates thgough them with {{this}} as the pagename
* `{{add @index 2}}` - Adds two numbers
* `{{Compare age 20 'this dude is exactly 20 years old' 'he's not 20 years old}}` - Compares values and returns string based on outcome of the comparison
* `{{{js_cms 'people'}}}` - Fetch cms file and outputs it as javascript object as string.
* `{{switch small '5px' medium '10px' large '20px'}}` - will output text based on which variable is truthful.

## Heroku
Enduro is heroku ready. Just make sure that enduro is in the dependencies of your project. To publish on heroku, just use these steps (heroku cli required):
* `git init` - initializes an empty git repo
* `heroku create` - creates new heroku application
* `git push heroku master` - pushes source code to heroku and deploys

## Secure
Enduro can be secured with a simple passphrase for sharing of projects during the development phase. To enable the passphrase security, just use this cli command:

```$ enduro secure passphrase```

to remove the passphrase, just delete the created .enduro_secure file

# Assets
Enduro stores all non-code files in an assets folder. Currently there is support for these subfolder

```
assets
├── css
│   ├── main.scss // sass proccesses this file only
├── fonts
├── img
├── js
├── spriteicons
├── vendor
```

## css
```main.scss``` file inside this folder gets processed with sass. Only additional thing is globbing, so it's possible to do ```@import 'mixins/*';``` to include whole directory

## spriteicons
png files in this folder get processes into a single spritesheet. It will be end up in assets/spriteicons/spritesheet.png and respective scss file will be in assets/css/sprites.scss. For retina support, just include filename@2x.png.

## vendor
This is the folder where bower components end up in. Do not change files in this folder as enduro will run bower install on server.

## Javascript accessible Handlebars templates
Enduro will precompile all handlebars templates located in /components folder, so they can be used with javascript. The compiled js files are accessible in _src/assets/hbs_templates

## Custom handlebars templates
Enduro will search `assets/hbs_helpers/` folder for custom helpers. These templates can be used out of the box in enduro compoments and pages. Additionally the helpers are concated and wrapped as amd module to be used by javascript on client. See below for syntax of how custom helpers should be written:

```javascript
__templating_engine.registerHelper('helpername', function(helperparameters) {
	return 'helperoutput'
});
```

To use handlebars helpers on client, you have to extend handlebars with these helpers. To do so, use assets/js/handlebars.js file. You will also have to specify path to handlebars as 'handlebars_core'.

## Babel
Enduro comes with multilingual support. Enabling this feature is super easy two-step process.

### 1. Define cultures
First create babel.js file in cms/config folder with simple js array containing culture names as strings.

cms/config/babel.js
```javascript
[
	'en',
	'de'
]
```

This will create all pages in respective subdirectories. For example, your index.hbs file will convert into en/index.html and de/index.html

### 2. Define translations
Insert the translated values like this:

cms/index.js
```javascript
{
	greeting: 'hello'
	$greeting_de: 'halo'
}
```

Non-terminated value will be used if no translation is given.

# Developing enduro
I welcome you to develop enduro.js. Follow these guides to get you started quickly:

## Developing core enduro
1. clone enduro repository
2. cd into enduro's directory
3. run `npm link`
4. now you can develop enduro


## Writing enduro tests
1. enduro has mocha tests
2. add your tests in the /test directory
2. run all tests just by running `mocha`

## Developing enduro admin
1. I decided to decouple admin interface from enduro to make things cleaner
2. enduro admin is built using enduro ( duh ;-) )
2. clone enduro_admin's git repo: https://github.com/kiskadigitalmedia/Enduro_admin
3. cd into enduro's directory
4. run `npm link ../enduro_admin` or wherever you cloned the enduro_admin to
5. run enduro on enduro_admin by `enduro -nr -noadmin`
6. run `enduro` on your project
7. now you can edit enduro admin's source code and see the change on your project at localhost:5000/admin