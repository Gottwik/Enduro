// * ———————————————————————————————————————————————————————— * //
// * 	linker
// *	enables injecting enduro modules more comfortably
// * ———————————————————————————————————————————————————————— * //
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

module.exports = linker
