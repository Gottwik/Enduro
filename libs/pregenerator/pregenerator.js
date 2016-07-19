// * ———————————————————————————————————————————————————————— * //
// * 	pregenerator
// *	pregenerates helper content
// * ———————————————————————————————————————————————————————— * //
var pregenerator = function () {}

// vendor dependencies
var Promise = require('bluebird')
var fs = require('fs')
var extend = require('extend')
var path = require("path")

// local dependencies
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')
var page_renderer = require(ENDURO_FOLDER + '/libs/page_rendering/page_renderer')
var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')

// Goes through the pages and renders them
pregenerator.prototype.pregenerate = function() {

	var promise_pregenerators = []
	for(p in pregenerators) {
		promise_pregenerators.push(pregenerators[p]())
	}

	return Promise.all(promise_pregenerators)
}

var pregenerators = []

pregenerators['settings'] = function() {
	return new Promise(function(resolve, reject){

		var settings_file_path = path.join(CMD_FOLDER, 'cms', '.settings.js')
		var css_settings_destination_file_path = path.join(CMD_FOLDER, '_src', '_prebuilt', '_settings.css')

		// just resolve if .settings.json file is missing
		if(!enduro_helpers.fileExists(settings_file_path)) {
			return resolve()
		}
		enduro_helpers.ensureDirectoryExistence(css_settings_destination_file_path)
			.then(() => {
				console.lo
				fs.writeFile(css_settings_destination_file_path, '.full-background{background-image:url(' + __data.global.settings.admin_background_image + ')}', () => {
					resolve()
				})
			})

	})
}



module.exports = new pregenerator()