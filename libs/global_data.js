// * ———————————————————————————————————————————————————————— * //
// * 	Global Data
// *	Loads global data - data to be used on all templates
// *	Good for shared resources - news, products...
// *	Loads .js files from /cms/global folder
// * ———————————————————————————————————————————————————————— * //
var global_data = function () {}

// Vendor dependencies
var Promise = require('bluebird')
var async = require('async')
var extend = require('extend')
var glob = require('multi-glob').glob

// Local dependencies
var logger = require(enduro.enduro_path + '/libs/logger')
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
var flat = require(enduro.enduro_path + '/libs/flat_db/flat')

global_data.prototype.get_global_data = function () {

	// Constants
	var data_path = [enduro.project_path + '/cms/global/**/*.js', enduro.project_path + '/cms/.settings.js']

	this.clear()

	return new Promise(function (resolve, reject) {

		// Fetches the files
		glob(data_path, function (err, files) {
			if (err) {
				logger.block(err, 'enduro_render_events')
				reject()
			}

			// Async goes through the files
			async.each(files, function (file, callback) {

				// Stores filename
				var filename = file.match(/([^\\/]+)\.([^\\/]+)$/)[1]

				// path relative to cms folder
				var fileInCms = file.match(/cms\/(.*)\.([^\\/]+)$/)[1]

				// Loads the file
				if (flat_helpers.file_exists_sync(file)) {
					flat.load(fileInCms)
						.then((data) => {
							// Extends global data with currently loaded data
							extend(true, enduro.cms_data.global, data)

							logger.twolog('global ' + filename, 'loaded', 'enduro_render_events')
							callback()
						}, () => {
							callback()
						})
				}

			}, () => {
				// After all global files are loaded
				logger.line('', 'enduro_render_events')
				resolve()
			})
		})
	})
}

// clears the global data
global_data.prototype.clear = function () {
	cms_data = {}
	cms_data.global = {}
}

module.exports = new global_data()
