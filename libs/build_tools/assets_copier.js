
// vendor dependencies
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs-extra'))
var path = require('path')
var watch = require('gulp-watch')
var _ = require('lodash')

// local dependencies
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
var logger = require(enduro.enduro_path + '/libs/logger')

// defines locations that have static files
var static_locations_to_watch = ['assets/img', 'assets/vendor', 'assets/fonts', 'assets/admin_extensions', 'remote']

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
// *	@return {string} - name of the gulp task
// * ———————————————————————————————————————————————————————— * //
assets_copier.prototype.init = function (gulp, browser_sync) {
	var self = this

	// stores task name
	var assets_copier_name = 'assets_copier'

	// registeres task to provided gulp
	gulp.task(assets_copier_name, function () {

		// check if remote should be watched
		if (enduro.flags.noremotewatch) {
			_.pull(static_locations_to_watch, 'remote')
		}

		// will store promises
		var copy_actions = []

		self.get_copy_from_and_copy_to_pairs()
			.map((pair) => {
				copy_actions.push(copy_if_exist(pair.copy_from, pair.copy_to))
			})

		// also copy /assets/root into the generated root folder
		copy_actions.push(self.copy_to_root_folder())

		// execute callback when all promises are resolved
		return Promise.all(copy_actions)

	})

	return assets_copier_name
}

// * ———————————————————————————————————————————————————————— * //
// * 	watch
// *
// * 	starts to watch for changes in the assets folders
// *	@param {object} gulp - gulp to register the task into
// *	@param {object} browser_sync - browser_sync object to refresh the browser on file update
// *	@return {string} - name of the gulp task
// * ———————————————————————————————————————————————————————— * //
assets_copier.prototype.watch = function (gulp, browser_sync) {
	var self = this

	var assets_copier_watch_name = 'assets_copier_watch'

	// registers task to provided gulp
	gulp.task(assets_copier_watch_name, function () {
		self.get_copy_from_and_copy_to_pairs()
			.map((pair) => {
				watch_for_static_change(pair.copy_from, pair.copy_to, browser_sync)
			})
		return Promise.resolve()
	})
	return assets_copier_watch_name
}

// * ———————————————————————————————————————————————————————— * //
// * 	get_copy_from_and_copy_to_pairs
// *
// *	will generate absolute paths to both source and destination
// *	static assets folders
// * ———————————————————————————————————————————————————————— * //
assets_copier.prototype.get_copy_from_and_copy_to_pairs = () => {
	return static_locations_to_watch
		.map((static_location) => {
			return {
				copy_from: path.join(enduro.project_path, static_location),
				copy_to: path.join(enduro.project_path, enduro.config.build_folder, static_location)
			}
		})
}

// * ———————————————————————————————————————————————————————— * //
// * 	copy_root_folder
// *
// *	will copy files from /assets/root to /_generated root folder
// *	this is useful for robots.txt or other files that just
// *	have to be served from the root folder
// * ———————————————————————————————————————————————————————— * //
assets_copier.prototype.copy_to_root_folder = () => {
	// stores from and to paths
	var copy_from = path.join(enduro.project_path, 'assets', 'root')
	var copy_to = path.join(enduro.project_path, enduro.config.build_folder)

	return copy_if_exist(copy_from, copy_to)
}

// * ———————————————————————————————————————————————————————— * //
// * 	copy_if_exist
// *
// * 	helper function that copies directory if it exists
// *	@param {string} copy_from - path of the folder to be copied
// *	@param {string} copy_to - destination path for the folder to be copied into
// *	@return {Promise} - resolved if copied successfully
// * ———————————————————————————————————————————————————————— * //
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
