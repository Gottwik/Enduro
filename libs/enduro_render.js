// * ———————————————————————————————————————————————————————— * //
// * 	enduro render
// *	goes throught all the pages and renders them with handlebars
// * ———————————————————————————————————————————————————————— * //
var enduro_render = function () {}

// vendor dependencies
var Promise = require('bluebird')

// local dependencies
var logger = require(enduro.enduro_path + '/libs/logger')
var page_renderer = require(enduro.enduro_path + '/libs/page_rendering/page_renderer')
var page_queue_generator = require(enduro.enduro_path + '/libs/page_rendering/page_queue_generator')

// Goes through the pages and renders them
enduro_render.prototype.render = function () {
	logger.timestamp('Render started', 'enduro_events')
	// gets list of pages to be generated
	return page_queue_generator.generate_pagelist()
		.then((pages_to_render) => {

			// converts the list of pages into list of promises
			var pages_to_render_promises = pages_to_render.map((page_to_render) => {
				return page_renderer.render_file(page_to_render.file, page_to_render.context_file, page_to_render.culture, page_to_render.destination_path)
			})
			// executes the promises and return resolved promise when all are finished
			return Promise.all(pages_to_render_promises)
		})

}

module.exports = new enduro_render()
