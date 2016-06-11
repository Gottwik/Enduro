// * ———————————————————————————————————————————————————————— * //
// * 	enduro render
// *	goes throught all the pages and renders them with handlebars
// * ———————————————————————————————————————————————————————— * //
var enduro_render = function () {}

// vendor dependencies
var Promise = require('bluebird')
var fs = require('fs')
var extend = require('extend')

// local dependencies
var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')
var flat_file_handler = require(ENDURO_FOLDER + '/libs/flat_utilities/flat_file_handler')
var globalizer = require(ENDURO_FOLDER + '/libs/globalizer/globalizer')
var page_renderer = require(ENDURO_FOLDER + '/libs/page_rendering/page_renderer')
var page_queue_generator = require(ENDURO_FOLDER + '/libs/page_rendering/page_queue_generator')

// Goes through the pages and renders them
enduro_render.prototype.render = function() {
	kiska_logger.timestamp('Render started', 'enduro_events')

	return page_queue_generator.generate_pagelist()
		.then((pages_to_render) => {

			var pages_to_render_promises = pages_to_render.map((page_to_render) => {
				return page_renderer.render_file(page_to_render.file, page_to_render.context_file, page_to_render.culture)
			})

			return Promise.all(pages_to_render_promises);
		})

}


module.exports = new enduro_render()