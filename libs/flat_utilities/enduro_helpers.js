// * ———————————————————————————————————————————————————————— * //
// * 	Enduro Helpers
// *	Random set of helper functions used all around
// * ———————————————————————————————————————————————————————— * //

var enduro_helpers = function () {}

// global dependencies
var Promise = require('bluebird')
var fs = require('fs')
var mkdirp = require('mkdirp')

// local dependencies
var logger = require(ENDURO_FOLDER + '/libs/logger')

// Checks if file exists
enduro_helpers.prototype.file_exists_sync = function (file_path) {
	try {
		return fs.statSync(file_path).isFile()
	} catch (err) { return false }
}

// Checks if directory exists
enduro_helpers.prototype.dir_exists_sync = function (file_path) {
	try {
		return fs.statSync(file_path).isDirectory()
	} catch (err) { return false }
}

// Checks if directory exists
enduro_helpers.prototype.dir_exists = function (file_path) {
	return new Promise(function (resolve, reject) {
		fs.stat(file_path, function (err, stats) {
			if (err) {
				reject()
				return
			}

			stats.isDirectory()
				? resolve()
				: reject()
		})
	})
}

// Creates all subdirectories neccessary to create the file in file_path
enduro_helpers.prototype.ensure_directory_existence = function () {
	if (!arguments.length) {
		return Promise.resolve()
	}
	file_paths = Array.prototype.slice.call(arguments).map((file_path) => { return file_path.split('/').slice(0, -1).join('/') })
	return Promise.all(file_paths.map((file_path) => { return ensure_directory_existence(file_path) }))
}

enduro_helpers.prototype.get_filename_from_url = function (file_path) {

	// strip path and keep just the filename
	file_path = file_path
		.split('/')
		.slice(-1)[0]

	// strip parameters
	if (file_path.indexOf('?')) {
		file_path = file_path.split('?')[0]
	}

	return file_path
}

enduro_helpers.prototype.is_local = function (file_path) {
	return file_path.indexOf('http') == -1 && file_path.indexOf('.com') == -1
}

function ensure_directory_existence (file_path) {
	return new Promise(function (resolve, reject) {
		mkdirp(file_path, function (err) {
			if (err) {
				logger.err_block(err)
				return reject()
			}
			resolve()

		})
	})
}

module.exports = new enduro_helpers()
