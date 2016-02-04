# Enduro

## Basic operation
enduro is static page generator / cms / build tool.

It goes through all files in pages folder, applies context with the same name and outputs .html files in _src folder. On top of this it processses scss files and copies assets to _src/assets.

## Enduro commands

 * `Enduro create`  - Creates folder structure and starts enduro for development
 * `Enduro` - Starts enduro for development
 * `Enduro stsart` - Starts enduro on server - Without build tools such as watching...

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

```html
<!-- components/button.hbs -->
<input type="button" value="button" class="{{button_class}}">
```

```html
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
## Helpers
* * `{{default class 'red'}}` - If no class parameter is provided 'red is being used'