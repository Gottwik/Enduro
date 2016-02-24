# Enduro

## Basic operation

enduro is static page generator / cms / build tool.

It goes through all files in pages folder, applies context with the same name and outputs .html files in _src folder. On top of this it processses scss files and copies assets to _src/assets.

## Enduro commands

If installed globally, enduro enables these cli commands

 * `Enduro create projectname`  - Creates new folder /projectname with neccessary scaffolding
 * `Enduro` - Starts enduro for development
 * `Enduro start` - Starts enduro on server - Without build tools such as watching
 * `Enduro build` - Runs requirejs optimization on assets/js/main.js

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
│   │   ├── spriteicons
│   │   ├── vendor
│   ├── cms
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
<!-- page/somepage.hbs -->
<p>{{person}} came and said {{said_what}}</p>
```

```javascript
// cms/somepage.js
module.exports = {
	person: "Big guy",
    said_what: "here's your pizza",
}
```

Will generate
```html
<!-- _src/somepage.html -->
<p>Big guy came and said here's your pizza</p>
```


## Helpers
* `{{default class 'red'}}` - If no class parameter is provided 'red' is being used
* `{{#times 10}}` - will repeat anything inside 10 times. Don't forget to close `{{/times}}`


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