// * ———————————————————————————————————————————————————————— * //
// * 	JS build
// *	Random set of helper functions used all around
// * ———————————————————————————————————————————————————————— * //
var js_build = function () {}

var Promise = require('bluebird')
var rjs = require('requirejs')

var flat_helpers = require(ENDURO_FOLDER + '/libs/flat_db/flat_helpers')
var logger = require(ENDURO_FOLDER + '/libs/logger')
var gulp = require(ENDURO_FOLDER + '/gulpfile')

// Creates all subdirectories neccessary to create the file in filepath
js_build.prototype.build_js = function (config_name) {
	gulp.start('production', () => {
		!config_name
			? config_name = ''
			: config_name = '_' + config_name

		var configpath = CMD_FOLDER + '/_src/assets/js/main' + config_name + '.js'

		if (!flat_helpers.file_exists_sync(configpath)) {
			return logger.err_block('No config file named main' + config_name + '.js')
		}

		return new Promise(function (resolve, reject) {
			config = {
				mainConfigFile: configpath,
				baseUrl: CMD_FOLDER + '/_src/assets/',
				name: 'js/main',
				out: CMD_FOLDER + '/_src/assets/js/main_dist.js',
				include: ['vendor/requirejs/require'],
				findNestedDependencies: true,
				optimize: 'uglify'
			}
			rjs.optimize(config, function (buildResponse) {
				console.log(buildResponse)
				// cb()
				resolve()
			}, function (err) {
				console.log(err)
				reject()
			})
		})
	})
}

module.exports = new js_build()
