// * ———————————————————————————————————————————————————————— * //
// * 	temper
// *	temporarily renders one page based on provided context
// * ———————————————————————————————————————————————————————— * //
var temper = function () {}

// vendor dependencies
var Promise = require('bluebird')
var fs = require('fs')
var extend = require('extend')

// local dependencies
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')
var page_renderer = require(ENDURO_FOLDER + '/libs/page_rendering/page_renderer')
var abstractor = require(ENDURO_FOLDER + '/libs/abstractor/abstractor')

// Goes through the pages and renders them
temper.prototype.render = function(filename, context) {

	return abstractor.abstract_context(context)
		.then((context) => {
			return page_renderer.render_file_by_filename_replace_context(filename, context)
		})
}


module.exports = new temper()