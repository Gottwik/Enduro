// * ———————————————————————————————————————————————————————— * //
// * 	Flat file handler
// * 	Handles flat file storage
// * ———————————————————————————————————————————————————————— * //
var flat_file_handler = function () {}

// Vendor dependencies
var Promise = require('bluebird')
var fs = require('fs')
var require_from_string = require('require-from-string')
var decode = require('urldecode')
var stringify_object = require('stringify-object')

// local dependencies
var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')


// * ———————————————————————————————————————————————————————— * //
// * 	Save cms file
// *	@param {String} filename - Path to file without extension, relative to /cms folder
// *	@param {Object} contents - Content to be saved
// *	@return {Promise} - Promise with no content. Resolve if saved successfully, reject otherwise
// * ———————————————————————————————————————————————————————— * //
flat_file_handler.prototype.save = function(filename, contents){
	return new Promise(function(resolve, reject){
		// TODO: maybe the file could be backed up somewhere before overwriting
		contents = contents || {}

		// url decode filename
		filename = decode(filename)

		var fullpath_to_cms_file = get_full_path_to_cms(filename)

		var flatObj = require_from_string('module.exports = ' + JSON.stringify(contents))

		// formats js file so it can be edited by hand later
		var prettyString = stringify_object(flatObj, {indent: '	', singleQuotes: true})

		// save cms file
		enduro_helpers.ensureDirectoryExistence(fullpath_to_cms_file)
			.then(() => {
				fs.writeFile( fullpath_to_cms_file , prettyString, function(err) {
					if(err) {
						reject()
					}
					resolve()
				})
			})
	})
}


// * ———————————————————————————————————————————————————————— * //
// * 	Save cms file with string as content
// *	@param {String} filename - Path to file without extension, relative to /cms folder
// *	@param {String} contents - Content to be saved
// *	@return {Promise} - Promise from save function
// * ———————————————————————————————————————————————————————— * //
flat_file_handler.prototype.save_by_string = function(filename, contents){
	return this.save(filename, JSON.parse(contents))
}


// * ———————————————————————————————————————————————————————— * //
// * 	Load cms file
// *	@param {String} filename - Path to file without extension, relative to /cms folder
// *	@return {Promise} - Promise returning an object
// * ———————————————————————————————————————————————————————— * //
flat_file_handler.prototype.load = function(filename) {
	var self = this

	return new Promise(function(resolve, reject) {

		// url decode filename
		filename = decode(filename)

		var fullpath_to_cms_file = get_full_path_to_cms(filename)

		// check if file exists. return empty object if not
		if(!enduro_helpers.fileExists(fullpath_to_cms_file)) {
			self.save(filename, {})
				.then(() => {
					resolve({})
				})
		} else {
			fs.readFile( fullpath_to_cms_file , function(err, data) {
				if (err) { reject() }

				// check if file is empty. return empty object if so
				if(data == '') {
					return resolve({})
				}

				var flatObj = require_from_string('module.exports = ' + data)
				resolve(flatObj)
			})
		}
	})
}


// * ———————————————————————————————————————————————————————— * //
// * 	Load cms file synchronously
// *	@param {String} filename - Path to file without extension, relative to /cms folder
// *	@return {Promise} - Promise returning an object
// * ———————————————————————————————————————————————————————— * //
flat_file_handler.prototype.loadsync = function(filename) {
	filename = decode(filename)

	if(!enduro_helpers.fileExists(CMD_FOLDER + '/cms/' + filename + '.js')) {
		return {}
	}

	data = fs.readFileSync( CMD_FOLDER + '/cms/' + filename + '.js', 'utf-8')
	return data
}


// * ———————————————————————————————————————————————————————— * //
// * 	Get full path of a cms file
// *	@param {String} filename - Path to file without extension, relative to /cms folder
// *	@return {String} - Returns full server path to specified file
// * ———————————————————————————————————————————————————————— * //
flat_file_handler.prototype.get_full_path_to_cms = get_full_path_to_cms


// * ———————————————————————————————————————————————————————— * //
// * 	Checks if specified file exists
// *	@param {String} filename - Path to file without extension, relative to /cms folder
// *	@return {Boolean} - Returns true if specified file exists
// * ———————————————————————————————————————————————————————— * //
flat_file_handler.prototype.file_exists = function(filename) {
	return enduro_helpers.fileExists(get_full_path_to_cms(filename))
}


// * ———————————————————————————————————————————————————————— * //
// * 	Adds content to a file.
// *	@param {String} filename - Path to file without extension, relative to /cms folder
// *	@param {Object} context_to_add - Content to be added
// *	@param {String} key - key in the root of the file where the specified content should be added. defaults to 'items'
// *	@return {Promise} - Returns promise from save function
// * ———————————————————————————————————————————————————————— * //
flat_file_handler.prototype.add = function(filename, context_to_add, key) {
	var self = this

	context_to_add = context_to_add || {}
	key = key || 'items'

	return self.load(filename)
		.then((context) => {
			if(!(key in context)) {
				context[key] = []
			}

			context[key].push(context_to_add)
			return self.save(filename, context)
		})
}


// Private functions
function get_full_path_to_cms(filename) {
	return CMD_FOLDER + '/cms/' + filename + '.js'
}

module.exports = new flat_file_handler()