// * ———————————————————————————————————————————————————————— * //
// * 	Enduro Helpers
// *	Random set of helper functions used all around
// * ———————————————————————————————————————————————————————— * //

var enduro_helpers = function () {};

var fs = require('fs')
var Promise = require('bluebird')
var mkdirp = require('mkdirp')

// Checks if file exists
enduro_helpers.prototype.fileExists = function (filePath) {
	try {
		return fs.statSync(filePath).isFile()
	}
	catch (err) { return false }
}

// Checks if directory exists
enduro_helpers.prototype.dirExists = function (filePath) {
	try {
		return fs.statSync(filePath).isDirectory();
	}
	catch (err) { return false }
}

// Creates all subdirectories neccessary to create the file in filepath
enduro_helpers.prototype.ensureDirectoryExistence = function(filePath) {
	filePath = filePath.match(/^(.*)\/.*$/)[1]
	return new Promise(function(resolve, reject){
		mkdirp(filePath, function(err) {
			if(err){ reject() }
			resolve();

		})
	})
}

module.exports = new enduro_helpers()