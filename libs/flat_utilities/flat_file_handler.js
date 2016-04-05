
// * ———————————————————————————————————————————————————————— * //
// * 	Flat file handler
// * ———————————————————————————————————————————————————————— * //

var Promise = require('bluebird');
var fs = require('fs')
var requireFromString = require('require-from-string');
var enduro_helpers = require('./enduro_helpers')
var decode = require('urldecode')
var stringifyObject = require('stringify-object')


var FlatFileHandler = function () {}



// Saves file from raw
FlatFileHandler.prototype.saveFlatRaw = function(filename, contents){
	return new Promise(function(resolve, reject){
		// TODO backup file be

		// url decode filename
		filename = decode(filename)

		var flatObj = requireFromString('module.exports = ' + contents)
		var prettyString = stringifyObject(flatObj, {indent: '	', singleQuotes: true})

		fs.writeFile( cmd_folder + '/cms/' + filename + '.js' , prettyString, function(err) {
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
		if(!enduro_helpers.fileExists(cmd_folder + '/cms/' + filename + '.js')){
			resolve({})
		}

		fs.readFile( cmd_folder + '/cms/' + filename + '.js' , function(err, data) {
			if (err) { reject() }

			// check if file is empty. return empty object if so
			if(data == ''){
				return resolve({})
			}

			var flatObj = requireFromString('module.exports = ' + data)
			resolve(flatObj)
		})
	})
}

// loads file synchronously
FlatFileHandler.prototype.loadsync = function(filename){
	filename = decode(filename)

	if(!enduro_helpers.fileExists(cmd_folder + '/cms/' + filename + '.js')){
		return {};
	}

	data = fs.readFileSync( cmd_folder + '/cms/' + filename + '.js', 'utf-8')
	return data;
}


module.exports = new FlatFileHandler()