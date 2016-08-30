
// vendor dependencies
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs-extra'))
var path = require('path')
var watch = require('gulp-watch')

// local dependencies
var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')

// * ———————————————————————————————————————————————————————— * //
// * 	assets_copier
// *	copies static assets such as images and fonts to _src folder
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
	gulp.task(assets_copier_name, function (cb) {

		// defines locations that have static files
		var static_locations = ['assets/js', 'assets/img', 'assets/vendor', 'assets/fonts', 'assets/admin_extensions']

		// will store promises
		var copy_actions = []

		// goes through all the static locations
		for (s in static_locations) {

			// stores from and to paths
			var copy_from = path.join(CMD_FOLDER, static_locations[s])
			var copy_to = path.join(CMD_FOLDER, '_src', static_locations[s])

			watch_for_static_change(copy_from, copy_to, browser_sync)

			// adds copy promise to the list
			copy_actions.push(copy_if_exist(copy_from, copy_to))
		}

		// execute callback when all promises are resolved
		Promise.all(copy_actions)
			.then(() => {
				cb()
			}, (err) => {
				kiska_logger.err(err)
			})

	})

	return assets_copier_name
}

// helper function that copies directory if it exists
function copy_if_exist (copy_from, copy_to) {
	return enduro_helpers.dir_exists(copy_from)
		.then(() => {
			return fs.copyAsync(copy_from, copy_to, {clobber: true})
		}, () => {})
}

// watches for changes
function watch_for_static_change (copy_from, copy_to, browser_sync) {
	watch([copy_from + '/**/*'], () => {
		fs.copyAsync(copy_from, copy_to, {clobber: true})
			.then(() => {
				browser_sync.reload()
			}, (err) => {
				kiska_logger.err(err)
			})
	})
}

module.exports = new assets_copier()
