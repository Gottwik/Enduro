
// vendor dependencies
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs-extra'))
var path = require('path')
var watch = require('gulp-watch')

// local dependencies
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
var logger = require(enduro.enduro_path + '/libs/logger')

// defines locations that have static files
var STATIC_LOCATIONS = ['assets/js', 'assets/img', 'assets/vendor', 'assets/fonts', 'assets/admin_extensions', 'remote']

// * ———————————————————————————————————————————————————————— * //
// * 	assets_copier
// *	copies static assets such as images and fonts to the build folder
// * ———————————————————————————————————————————————————————— * //
var assets_copier = function () {}

// * ———————————————————————————————————————————————————————— * //
// * 	init
// *
// * 	registeres copying task
// *	@param {object} gulp - gulp to register the task into
// *	@return {} - will call an empty callback
// * ———————————————————————————————————————————————————————— * //
assets_copier.prototype.init = function (gulp, browser_sync) {

	// stores task name
	var assets_copier_name = 'assets_copier'

	// registeres task to provided gulp
	gulp.task(assets_copier_name, function () {


		// will store promises
		var copy_actions = []

		// goes through all the static locations
		for (s in STATIC_LOCATIONS) {

			// stores from and to paths
			var copy_from = path.join(enduro.project_path, STATIC_LOCATIONS[s])
			var copy_to = path.join(enduro.project_path, enduro.config.build_folder, STATIC_LOCATIONS[s])
			// watch_for_static_change(copy_from, copy_to, browser_sync)

			// adds copy promise to the list
			copy_actions.push(copy_if_exist(copy_from, copy_to))
		}

		// execute callback when all promises are resolved
		return Promise.all(copy_actions)

	})

	return assets_copier_name
}

assets_copier.prototype.watch = function (gulp, browser_sync) {

	var assets_copier_watch_name = 'assets_copier_watch'

	// registeres task to provided gulp
	gulp.task(assets_copier_watch_name, function () {

		// goes through all the static locations
		for (s in STATIC_LOCATIONS) {

			// stores from and to paths
			var copy_from = path.join(enduro.project_path, STATIC_LOCATIONS[s])
			var copy_to = path.join(enduro.project_path, enduro.config.build_folder, STATIC_LOCATIONS[s])

			watch_for_static_change(copy_from, copy_to, browser_sync)

		}
	})

	return assets_copier_watch_name
}

// helper function that copies directory if it exists
function copy_if_exist (copy_from, copy_to) {
	return flat_helpers.dir_exists(copy_from)
		.then(() => {
			return fs.copyAsync(copy_from, copy_to, { overwrite: true })
		}, () => {})
}

// watches for changes
function watch_for_static_change (copy_from, copy_to, browser_sync) {
	if (!enduro.flags.nowatch) {
		watch([copy_from + '/**/*'], () => {
			fs.copyAsync(copy_from, copy_to, { overwrite: true })
				.then(() => {
					browser_sync.reload()
				}, (err) => {
					logger.err(err)
				})
		})
	}
}

module.exports = new assets_copier()
