// * ———————————————————————————————————————————————————————— * //
// * 	Flat file handler
// * ———————————————————————————————————————————————————————— * //

var Promise = require('bluebird');
var fs = require('fs')
var require_from_string = require('require-from-string')
var decode = require('urldecode')
var stringify_object = require('stringify-object')

var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')

var FlatFileHandler = function () {}


// Saves file from raw
FlatFileHandler.prototype.save = function(filename, contents){
	return new Promise(function(resolve, reject){
		// TODO backup file be

		contents = contents || {};

		// url decode filename
		filename = decode(filename)

		var fullpath_to_cms_file = get_full_path_to_cms(filename)

		var flatObj = require_from_string('module.exports = ' + JSON.stringify(contents))
		var prettyString = stringify_object(flatObj, {indent: '	', singleQuotes: true})
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

// Provides object from filename
FlatFileHandler.prototype.load = function(filename) {
	var self = this

	return new Promise(function(resolve, reject) {
		// TODO backup file be

		// url decode filename
		filename = decode(filename)

		var fullpath_to_cms_file = get_full_path_to_cms(filename)

		// check if file exists. return empty object if not
		if(!enduro_helpers.fileExists(fullpath_to_cms_file)) {
			self.save(filename, '{}')
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

// loads file synchronously
FlatFileHandler.prototype.loadsync = function(filename) {
	filename = decode(filename)

	if(!enduro_helpers.fileExists(CMD_FOLDER + '/cms/' + filename + '.js')) {
		return {};
	}

	data = fs.readFileSync( CMD_FOLDER + '/cms/' + filename + '.js', 'utf-8')
	return data;
}

FlatFileHandler.prototype.get_full_path_to_cms = get_full_path_to_cms;

function get_full_path_to_cms(filename) {
	return CMD_FOLDER + '/cms/' + filename + '.js'
}

FlatFileHandler.prototype.file_exists = function(filename) {
	return enduro_helpers.fileExists(get_full_path_to_cms(filename))
}

FlatFileHandler.prototype.add = function(filename, context_to_add, key) {
	var self = this

	context_to_add = context_to_add || {}
	key = key || 'items'

	return self.load(filename)
		.then((context) => {
			context[key] = context_to_add
			return self.save(filename, context)
		})
}


module.exports = new FlatFileHandler()