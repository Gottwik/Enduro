// * ———————————————————————————————————————————————————————— * //
// * 	helper handler
// *	reads and registers helpers
// * ———————————————————————————————————————————————————————— * //
var helper_handler = function () {}

// vendor dependencies
var Promise = require('bluebird')
var async = require('async')
var glob = require('multi-glob').glob
var path = require('path')

// local dependencies
var logger = require(ENDURO_FOLDER + '/libs/logger')

// constants
var ENDURO_HELPERS_PATH = path.join(__dirname, '..', 'hbs_helpers/**/*.js')
var PROJECT_HELPERS_PATH = CMD_FOLDER + '/assets/hbs_helpers/**/*.js'

// * ———————————————————————————————————————————————————————— * //
// * 	read helpers
// *	loads the helpers from enduro and from local enduro app
// *	@return {Promise} - Promise with no content. Resolve if all helpers are registered
// * ———————————————————————————————————————————————————————— * //
helper_handler.prototype.read_helpers = function () {
	return new Promise(function (resolve, reject) {
		glob([ENDURO_HELPERS_PATH, PROJECT_HELPERS_PATH], function (err, files) {
			if (err) { return console.log(err) }
			async.each(files, function (file, callback) {
				var fileReg = file.match(/([^\\/]+)\.([^\\/]+)$/)
				var filename = fileReg[1]
				require(file)
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
