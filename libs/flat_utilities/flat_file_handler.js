
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

		fs.writeFile( process.cwd() + '/cms/' + filename + '.js' , prettyString, function(err) {
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

		if(!enduro_helpers.fileExists(process.cwd() + '/cms/' + filename + '.js')){
			resolve({})
		}

		fs.readFile( process.cwd() + '/cms/' + filename + '.js' , function(err, data) {
			if (err) { reject() }
			var flatObj = requireFromString('module.exports = ' + data)
			resolve(flatObj)
		})
	})
}


module.exports = new FlatFileHandler()