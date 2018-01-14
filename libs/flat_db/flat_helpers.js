// * ———————————————————————————————————————————————————————— * //
// * 	Enduro Helpers
// *	Random set of helper functions used all around
// * ———————————————————————————————————————————————————————— * //

const flat_helpers = function () {}

// * vendor dependencies
const Promise = require('bluebird')
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const rimraf = require('rimraf')

// * enduro dependencies
const logger = require(enduro.enduro_path + '/libs/logger')

// * ———————————————————————————————————————————————————————— * //
// * 	file exists sync
// * 	synchronously checks if file exists
// * 
// *	@param {string} file_path - absolute path to the file
// *	@return {boolean} - true if file exists, false not
// * ———————————————————————————————————————————————————————— * //
flat_helpers.prototype.file_exists_sync = function (file_path) {
	try {
		return fs.statSync(file_path).isFile()
	} catch (err) { return false }
}

// * ———————————————————————————————————————————————————————— * //
// * 	file exists
// * 	checks if file exists - also guarantees file points to a file and not a folder
// * 
// *	@param {string} file_path - absolute path to the file
// *	@return {promise} - resolved if file exists, rejects if not
// * ———————————————————————————————————————————————————————— * //
flat_helpers.prototype.file_exists = function (file_path) {
	return new Promise(function (resolve, reject) {
		fs.stat(file_path, (err, stat) => {
			if (err) {
				reject()
			}

			if (stat.isFile()) {
				resolve()
			} else {
				reject()
			}
		})
	})
}

// * ———————————————————————————————————————————————————————— * //
// * 	dir exists sync
// * 	synchronously checks if directory exists
// * 
// *	@param {string} path_to_folder - absolute path to the directory
// *	@return {boolean} - true if folder exists, false if not
// * ———————————————————————————————————————————————————————— * //
flat_helpers.prototype.dir_exists_sync = function (path_to_folder) {
	try {
		return fs.statSync(path_to_folder).isDirectory()
	} catch (err) { return false }
}

// * ———————————————————————————————————————————————————————— * //
// * 	dir exists
// * 	checks if directory exists. Also guarantees path points to a folder and not a file
// * 
// *	@param {string} path_to_folder - absolute path to the directory
// *	@return {promise} - resolves if folder exists, rejects if not
// * ———————————————————————————————————————————————————————— * //
flat_helpers.prototype.dir_exists = function (path_to_folder) {
	return new Promise(function (resolve, reject) {
		fs.stat(path_to_folder, function (err, stats) {
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

// * ———————————————————————————————————————————————————————— * //
// * 	ensure directory existence
// * 	recursivelly creates all neccessary subdirectories for the file to be created
// * 
// * 	important thing to understand is that ensure_directory_existence('/some/directory/something')
// *	will create `/some/directory`, expecitng `something` will be a file you will try to create later
// *	if you wanted to create also the `something` directory, you have to do ensure_directory_existence('/some/directory/something/fakeout.txt')
// * 
// *	@param {list of strings} - paths for the directories to be prepared 
// *	@return {promise} - resolves after all of the subdirectories have been created
// * ———————————————————————————————————————————————————————— * //
flat_helpers.prototype.ensure_directory_existence = function () {

	// just resolve if no arguments passed
	if (!arguments.length) {
		return Promise.resolve()
	}
	file_paths = Array.prototype.slice.call(arguments).map((file_path) => {
		return file_path.split(path.sep).slice(0, -1).join(path.sep)
	})
	return Promise.all(file_paths.map((file_path) => { return _create_folder(file_path) }))
}

// * ———————————————————————————————————————————————————————— * //
// * 	get filename from url
// * 
// * 	takes in url such as `http://endurojs.com/something.json?limit=2` and returns `something.json`
// * 
// *	@param {string} file_path - url or path to get the filename out of
// *	@return {string} - file name
// * ———————————————————————————————————————————————————————— * //
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

// * ———————————————————————————————————————————————————————— * //
// * 	is local
// * 
// * 	tries to figure out if string is a url or a local path to a file
// * 
// *	@param {string} file_path - url or path
// *	@return {boolean} - true if string is a local path, false otherwise
// * ———————————————————————————————————————————————————————— * //
flat_helpers.prototype.is_local = function (file_path) {
	return file_path.indexOf('http') == -1 && file_path.indexOf('.com') == -1
}

// * ———————————————————————————————————————————————————————— * //
// * 	delete folder
// * 
// *	@param {string} absolute_path - absolute path to the folder to be deleted
// *	@return {promise} - resolves after folder is deleted
// * ———————————————————————————————————————————————————————— * //
flat_helpers.prototype.delete_folder = function (absolute_path) {
	return new Promise(function (resolve, reject) {
		rimraf(absolute_path, () => {
			resolve()
		})
	})
}

// * ———————————————————————————————————————————————————————— * //
// * 	add meta context
// #	will add unix timestamp to the top of the file for juicebox to be able to decide which file is newer
// * 
// *	@param {object} context - context that the meta will be added to
// *	@return {nothing} - returns nothing, the meta has been be added to the provided context
// * ———————————————————————————————————————————————————————— * //
flat_helpers.prototype.add_meta_context = function (context) {
	const self = this

	context.meta = {}
	context.meta.last_edited = self.get_current_timestamp()
}

// * ———————————————————————————————————————————————————————— * //
// * 	get current timestamp
// #	returns unix timestamp, just decoupled to reduce duplicates
// * 
// *	@return {number} - unix timestamp
// * ———————————————————————————————————————————————————————— * //
flat_helpers.prototype.get_current_timestamp = function () {
	return Math.floor(Date.now() / 1000)
}

// * ———————————————————————————————————————————————————————— * //
// * 	create folder
// #	creates a folder
// * 
// *	@param {string} file_path - absolute path to the folder to be created
// *	@return {promise} - resolves once the folder has been created
// * ———————————————————————————————————————————————————————— * //
function _create_folder (file_path) {
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
