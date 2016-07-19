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

// Goes through the pages and renders them
temper.prototype.render = function(filename, extended_context) {
	return page_renderer.render_file_by_filename_extend_context(filename, extended_context)
}


module.exports = new temper()