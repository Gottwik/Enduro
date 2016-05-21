// * ———————————————————————————————————————————————————————— * //
// * 	Enduro Helpers
// *	Random set of helper functions used all around
// * ———————————————————————————————————————————————————————— * //

var enduro_helpers = function () {};

var fs = require('fs')
var Promise = require('bluebird')
var mkdirp = require('mkdirp')

// Checks if file exists
enduro_helpers.prototype.fileExists = function (file_path) {
	try {
		return fs.statSync(file_path).isFile()
	}
	catch (err) { return false }
}

// Checks if directory exists
enduro_helpers.prototype.dirExists = function (file_path) {
	try {
		return fs.statSync(file_path).isDirectory();
	}
	catch (err) { return false }
}

// Creates all subdirectories neccessary to create the file in file_path
enduro_helpers.prototype.ensureDirectoryExistence = function(file_path) {
	file_path = file_path.match(/^(.*)\/.*$/)[1]
	return new Promise(function(resolve, reject){
		mkdirp(file_path, function(err) {
			if(err){ reject() }
			resolve();

		})
	})
}

module.exports = new enduro_helpers()