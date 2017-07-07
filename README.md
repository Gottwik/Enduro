# enduro.js

[![Join the chat at https://gitter.im/Enduro-js/Lobby](https://badges.gitter.im/Enduro-js/Lobby.svg)](https://gitter.im/Enduro-js/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![npm version](https://badge.fury.io/js/enduro.svg)](https://badge.fury.io/js/enduro)
[![npm](https://img.shields.io/npm/dm/enduro.svg?maxAge=2592000)](https://www.npmjs.com/package/enduro)
[![Build Status](https://travis-ci.org/Gottwik/Enduro.svg?branch=master)](https://travis-ci.org/Gottwik/Enduro)
[![Coverage Status](https://coveralls.io/repos/github/Gottwik/Enduro/badge.svg?branch=master)](https://coveralls.io/github/Gottwik/Enduro?branch=master)
[![Code Climate](https://codeclimate.com/github/Gottwik/Enduro/badges/gpa.svg)](https://codeclimate.com/github/Gottwik/Enduro)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/Gottwik/Enduro/master/License.md)


Enduro is minimalistic, lean & mean, node.js cms. See more at [enduro.js website](http://www.endurojs.com/)

**Other repositories:** Enduro • [samples](https://github.com/Gottwik/enduro_samples) • [Enduro admin](https://github.com/Gottwik/enduro_admin) • [endurojs.com site](https://github.com/Gottwik/enduro_website)

![enduro admin](http://i.imgur.com/3TdMJlY.jpg)
![enduro admin](http://i.imgur.com/4PHp7me.jpg)
![enduro admin](http://i.imgur.com/4OheTyl.jpg)
![enduro admin](http://i.imgur.com/0IpLtzU.jpg)

## Documentation
Complete, structured documentation is available here [http://www.endurojs.com/docs](http://www.endurojs.com/docs)

### CSS Pre-processors

Instead of using SASS, you can use the LESS pre-processor instead. To do this, set a `less` object in your config file. This consists of a `paths` array which is the same as one defined here: http://lesscss.org/#using-less

``` json
{
    "less": {
        "paths": []
    }
}
```

Once that is set, simply add a `.less` file in your `assets/css` folder.

## Getting started

![enduro create](http://i.imgur.com/DtxhA7z.gif)

1. Make sure you have node.js installed. Grab it here if you don't: [nodejs installer](https://nodejs.org/en/download/).
1. Run `npm install enduro -g` in your terminal. This will install enduro.
1. Run `enduro create myproject`. This will create new folder /myproject with the enduro project
1. Go in the newly created folder by running `cd myproject`.
1. Start enduro in development mode by running simply `enduro`. Browser window should open with the website running.
1. Done!
2. Also, **Admin** interface is accessible at `localhost:5000`. Add admin user by running `enduro admin add username password`.

# Developing enduro
I welcome you to develop enduro.js. Follow these guides to get you started quickly:

1. clone enduro repository
2. cd into enduro's directory
3. run `npm link`
4. now you can develop enduro


## Writing enduro tests
1. enduro has mocha tests
2. add your tests in the /test directory
2. run all tests just by running `npm test`

## Developing enduro admin
1. I decided to decouple admin interface from enduro to make things cleaner
2. enduro admin is built using enduro ( duh ;-) )
2. clone enduro_admin's git repo: https://github.com/Gottwik/Enduro_admin
3. cd into enduro's directory
4. run `npm link ../enduro_admin` or wherever you cloned the enduro_admin to
5. run enduro on enduro_admin by `enduro -nr -noadmin`
6. run `enduro` on your project
7. now you can edit enduro admin's source code and see the change on your project at localhost:5000/admin
