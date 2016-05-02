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
FlatFileHandler.prototype.saveFlatRaw = function(filename, contents){
	return new Promise(function(resolve, reject){
		// TODO backup file be

		// url decode filename
		filename = decode(filename)

		var flatObj = require_from_string('module.exports = ' + contents)
		var prettyString = stringify_object(flatObj, {indent: '	', singleQuotes: true})

		fs.writeFile( CMD_FOLDER + '/cms/' + filename + '.js' , prettyString, function(err) {
			if (err) { reject() }
				resolve()
		})
	})
}

// Provides object from filename
FlatFileHandler.prototype.load = function(filename){
	return new Promise(function(resolve, reject){
		// TODO backup file be

		// url decode filename
		filename = decode(filename)

		// check if file exists. return empty object if not
		if(!enduro_helpers.fileExists(CMD_FOLDER + '/cms/' + filename + '.js')){
			resolve({})
		}

		fs.readFile( CMD_FOLDER + '/cms/' + filename + '.js' , function(err, data) {
			if (err) { reject() }

			// check if file is empty. return empty object if so
			if(data == ''){
				return resolve({})
			}

			var flatObj = require_from_string('module.exports = ' + data)
			resolve(flatObj)
		})
	})
}

// loads file synchronously
FlatFileHandler.prototype.loadsync = function(filename){
	filename = decode(filename)

	if(!enduro_helpers.fileExists(CMD_FOLDER + '/cms/' + filename + '.js')){
		return {};
	}

	data = fs.readFileSync( CMD_FOLDER + '/cms/' + filename + '.js', 'utf-8')
	return data;
}


module.exports = new FlatFileHandler()