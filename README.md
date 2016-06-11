# Enduro

[![npm version](https://badge.fury.io/js/enduro.svg)](https://badge.fury.io/js/enduro)
[![Build Status](https://travis-ci.org/kiskadigitalmedia/Enduro.svg?branch=master)](https://travis-ci.org/kiskadigitalmedia/Enduro)
[![Coverage Status](https://coveralls.io/repos/github/kiskadigitalmedia/Enduro/badge.svg?branch=master)](https://coveralls.io/github/kiskadigitalmedia/Enduro?branch=master)
[![Code Climate](https://codeclimate.com/github/kiskadigitalmedia/Enduro/badges/gpa.svg)](https://codeclimate.com/github/kiskadigitalmedia/Enduro)

Enduro is minimalistic , lean & mean, static page generator / cms / build tool.

## Enduro commands

If installed globally, enduro enables these cli commands

 * `Enduro create projectname`  - Creates new folder /projectname with neccessary scaffolding
 * `Enduro` - Starts enduro for development
 * `Enduro start` - Starts enduro on server - Without build tools such as watching
 * `Enduro build` - Runs requirejs optimization on assets/js/main.js. To have more requirejs config files use `enduro build dev` which will search for main_dev.js config file

## Project directory structure

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

### Using associated content files
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
* `{{lorem 20}}` - will generate dummy text with a lenght of 20 words
* `{{compare var1 var2 'true' 'false'}}` - will compare two variables and pick 'true' or 'false' in a ternary-like fashion
* `{{grouped_each 3 list}}` - Same as each, but will provide three items as context in each iteration
* `{{uriencode url}}` - Self explanatory. Encodes given string to uri
* `{{files 'assets/js'}}` - Globs the files and iterates thgough them with {{this}} as the pagename

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