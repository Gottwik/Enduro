
// * ———————————————————————————————————————————————————————— * //
// * 	Components handler
// *	Loads components. Note that even if component is stored
// *	in subdirectory, it's name will be just the file name
// * ———————————————————————————————————————————————————————— * //

var Promise = require('bluebird');
var fs = require('fs')
var async = require("async")
var glob = require("glob")
var kiskaLogger = require('./kiska_logger')

var ComponentHandler = function () {}

// Path to components
var COMPONENTS_PATH = CMD_FOLDER + '/components/**/*.hbs'

// Goes through all components in @COMPONENTS_PATH and attempts to load them
// Returns promise
ComponentHandler.prototype.readComponents = function(){
	return new Promise(function(resolve, reject){

		// Fetches the files
		glob( COMPONENTS_PATH , function (err, files) {
			if (err) { return kiskaLogger.errBlock(err) }

			// Async goes through the files
			async.each(files, function(file, callback) {

				// Stores file name and file extension
				var fileReg = file.match(/([^\\/]+)\.([^\\/]+)$/)
				var filename = fileReg[1]
				var fileext = fileReg[2]

				// Reads the file. @data stores the component's raw contents
				fs.readFile(file, 'utf8', function (err,data) {
					if (err) { reject(err) }

					// Register the component
					__templating_engine.registerPartial(filename.toLowerCase(), data)
					kiskaLogger.twolog('component ' + filename, 'registered')
					callback()
				})
			}, function(){

				// After all components are loaded
				kiskaLogger.line();
				resolve()
			})
		})
	})
}

module.exports = new ComponentHandler()