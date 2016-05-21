// * ———————————————————————————————————————————————————————— * //
// * 	Global Data
// *	Loads global data - data to be used on all templates
// *	Good for shared resources - news, products...
// *	Loads .js files from /cms/global folder
// * ———————————————————————————————————————————————————————— * //
var global_data = function () {}

// Vendor dependencies
var Promise = require('bluebird')
var async = require("async")
var extend = require('extend')
var glob = require("glob")

// Local dependencies
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')
var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')
var flatFileHandler = require(ENDURO_FOLDER + '/libs/flat_utilities/flat_file_handler')

// Constants
var DATA_PATH = CMD_FOLDER + '/cms/global/**/*.js'

global_data.prototype.get_global_data = function() {
	return new Promise(function(resolve, reject) {

		// Fetches the files
		glob( DATA_PATH , function (err, files) {
			if (err) {
				kiska_logger.block(err, 'enduro_render_events')
				reject()
			}

			// Async goes through the files
			async.each(files, function(file, callback) {

				// Stores filename
				var filename = file.match(/([^\\/]+)\.([^\\/]+)$/)[1]

				// path relative to cms folder
				var fileInCms = file.match(/cms\/(.*)\.([^\\/]+)$/)[1]

				// Loads the file
				var data = {}
				if(enduro_helpers.fileExists(file)) {
					flatFileHandler.load(fileInCms)
						.then((data) => {
							// Extends global data with currently loaded data
							extend(true, __data.global, data)

							kiska_logger.twolog('global ' + filename, 'loaded', 'enduro_render_events')
							callback()
						}, () => {
							callback()
						})
				}

			}, () => {
				// After all global files are loaded
				kiska_logger.line('', 'enduro_render_events')
				resolve()
			})
		})
	})
}

// clears the global data
global_data.prototype.clear = function() {
	__data = {}
	__data.global = {}
}

module.exports = new global_data()