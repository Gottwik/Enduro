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

linker.templating_engine = require('promised-handlebars')(require('handlebars'), { Promise: Promise })


module.exports = linker
