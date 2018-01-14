// * ———————————————————————————————————————————————————————— * //
// * 	Global Data
// *	Loads global data - data to be used on all templates
// *	Good for shared resources - news, products...
// *	Loads .js files from /cms/global folder
// * ———————————————————————————————————————————————————————— * //
const global_data = function () {}

// * vendor dependencies
const Promise = require('bluebird')
const async = require('async')
const extend = require('extend')
const glob = require('multi-glob').glob

// * enduro dependencies
const logger = require(enduro.enduro_path + '/libs/logger')
const flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
const flat = require(enduro.enduro_path + '/libs/flat_db/flat')

global_data.prototype.get_global_data = function () {

	// Constants
	const data_path = [enduro.project_path + '/cms/global/**/*.js', enduro.project_path + '/cms/.settings.js']

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
				const filename = file.match(/([^\\/]+)\.([^\\/]+)$/)[1]

				// path relative to cms folder
				const fileInCms = file.match(/cms\/(.*)\.([^\\/]+)$/)[1]

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
	enduro.cms_data = {}
	enduro.cms_data.global = {}
}

module.exports = new global_data()
