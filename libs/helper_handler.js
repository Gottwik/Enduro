// * ———————————————————————————————————————————————————————— * //
// * 	helper handler
// *	reads and registers helpers
// * ———————————————————————————————————————————————————————— * //
const helper_handler = function () {}

// * vendor dependencies
const Promise = require('bluebird')
const async = require('async')
const glob = require('multi-glob').glob
const path = require('path')

// * enduro dependencies
const logger = require(enduro.enduro_path + '/libs/logger')

// constants
const flat_helpers_PATH = path.join(__dirname, '..', 'hbs_helpers/**/*.js')
const PROJECT_HELPERS_PATH = enduro.project_path + '/assets/hbs_helpers/**/*.js'

// * ———————————————————————————————————————————————————————— * //
// * 	read helpers
// *	loads the helpers from enduro and from local enduro app
// *	@return {Promise} - Promise with no content. Resolve if all helpers are registered
// * ———————————————————————————————————————————————————————— * //
helper_handler.prototype.read_helpers = function () {
	return new Promise(function (resolve, reject) {
		glob([flat_helpers_PATH, PROJECT_HELPERS_PATH], function (err, files) {
			if (err) { return console.log(err) }
			async.each(files, function (file, callback) {
				const fileReg = file.match(/([^\\/]+)\.([^\\/]+)$/)
				const filename = fileReg[1]

				const helper = require(file)

				if (helper.register) {
					require(file).register()
				}

				logger.twolog('helper ' + filename, 'registered', 'enduro_render_events')
				callback()
			}, function () {
				logger.line('enduro_render_events')
				resolve()
			})
		})
	})
}

module.exports = new helper_handler()
