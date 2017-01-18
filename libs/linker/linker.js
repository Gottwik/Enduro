// * ———————————————————————————————————————————————————————— * //
// * 	linker
// *	enables injecting enduro modules more comfortably
// * ———————————————————————————————————————————————————————— * //
var linker = {}

var links = {
	'temper': '/libs/temper/temper',
	'pagelist_generator': '/libs/build_tools/pagelist_generator',
	'flat_file_handler': '/libs/flat_utilities/flat_file_handler',
	'logger': '/libs/logger',
}

for (link in links) {
	linker[link] = require(ENDURO_FOLDER + links[link])
}

module.exports = linker
