// * ———————————————————————————————————————————————————————— * //
// * 	Enduro Helpers
// *	Random set of helper functions used all around
// * ———————————————————————————————————————————————————————— * //

var flat_helpers = function () {}

// global dependencies
var Promise = require('bluebird')
var fs = require('fs')
var mkdirp = require('mkdirp')
var path = require('path')
var rimraf = require('rimraf')

// local dependencies
var logger = require(enduro.enduro_path + '/libs/logger')

// Checks if file exists
flat_helpers.prototype.file_exists_sync = function (file_path) {
	try {
		return fs.statSync(file_path).isFile()
	} catch (err) { return false }
}

// Checks if directory exists
flat_helpers.prototype.dir_exists_sync = function (file_path) {
	try {
		return fs.statSync(file_path).isDirectory()
	} catch (err) { return false }
}

// Checks if directory exists
flat_helpers.prototype.dir_exists = function (file_path) {
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
flat_helpers.prototype.ensure_directory_existence = function () {
	if (!arguments.length) {
		return Promise.resolve()
	}
	file_paths = Array.prototype.slice.call(arguments).map((file_path) => { return file_path.split(path.sep).slice(0, -1).join(path.sep) })
	return Promise.all(file_paths.map((file_path) => { return ensure_directory_existence(file_path) }))
}

flat_helpers.prototype.get_filename_from_url = function (file_path) {
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

flat_helpers.prototype.is_local = function (file_path) {
	return file_path.indexOf('http') == -1 && file_path.indexOf('.com') == -1
}

flat_helpers.prototype.delete_folder = function (absolute_path) {
	return new Promise(function (resolve, reject) {
		rimraf(absolute_path, () => {
			resolve()
		})
	})
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

module.exports = new flat_helpers()
