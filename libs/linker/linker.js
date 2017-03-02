// * ———————————————————————————————————————————————————————— * //
// * 	linker
// *	enables injecting enduro modules more comfortably
// * ———————————————————————————————————————————————————————— * //

// vendor depencies
var Promise = require('bluebird')

var linker = {}

var links = {
	'temper': '/libs/temper/temper',
	'pagelist_generator': '/libs/build_tools/pagelist_generator',
	'flat': '/libs/flat_db/flat',
	'flat_helpers': '/libs/flat_db/flat_helpers',
	'logger': '/libs/logger',
}

for (link in links) {
	linker[link] = require(ENDURO_FOLDER + links[link])
}

// stores templating engine for possible future replacement
// promised handlebars allows for asynchronous calls inside helpers
linker.templating_engine = require('promised-handlebars')(require('handlebars'), { Promise: Promise })

// stores markdownifier. It is initialized during render phase
linker.markdownifier = require(ENDURO_FOLDER + '/libs/markdown/markdownifier')


module.exports = linker
