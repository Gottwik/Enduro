// * ———————————————————————————————————————————————————————— * //
// * 	Handles adding new page
// * ———————————————————————————————————————————————————————— * //
var page_adding_service = function () {}

// vendor dependencies
var Promise = require('bluebird')
var path = require('path')

// local dependencies
var flat_file_handler = require(ENDURO_FOLDER + '/libs/flat_utilities/flat_file_handler')

page_adding_service.prototype.new_generator_page = function (new_pagename, generator) {
	return new Promise(function (resolve, reject) {
		flat_file_handler.load(path.join('generators', generator, generator))
			.then((template_content) => {
				return flat_file_handler.save(path.join('generators', generator, new_pagename), template_content)
			})
			.then(() => {
				resolve()
			})
	})
}

module.exports = new page_adding_service()
