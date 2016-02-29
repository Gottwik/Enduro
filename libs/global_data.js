
// * ———————————————————————————————————————————————————————— * //
// * 	Global Data
// *	Loads global data - data to be used on all templates
// *	Good for shared resources - news, products...
// *	Loads .js files from /cms/global folder
// * ———————————————————————————————————————————————————————— * //

var GlobalData = function () {}

var Promise = require('bluebird')
var async = require("async")
var extend = require('extend')
var glob = require("glob")
var kiskaLogger = require('./kiska_logger')
var enduro_helpers = require('./flat_utilities/enduro_helpers')
var flatFileHandler = require('./flat_utilities/flat_file_handler');

var DATA_PATH = cmd_folder + '/cms/global/*.js'

GlobalData.prototype.getGlobalData = function(){
	return new Promise(function(resolve, reject){

		// Fetches the files
		glob( DATA_PATH , function (err, files) {
			if (err) {
				kiskaLogger.block(err)
				reject()
			}

			// Async goes through the files
			async.each(files, function(file, callback) {

				// Stores filename
				var filename = file.match(/([^\\/]+)\.([^\\/]+)$/)[1]

				// path relative to cms folder
				var fileInCms = file.match(/cms\/(.*)\.([^\\/]+)$/)[1]

				// Loads the file
				var data = {}
				if(enduro_helpers.fileExists(file)){
					flatFileHandler.load(fileInCms)
						.then((data) => {
							// Extends global data with currently loaded data
							extend(true, __data, data)

							kiskaLogger.twolog('global ' + filename, 'loaded')
							callback()
						}, () => {
							callback()
						})
				}

			}, () => {
				// After all global files are loaded
				kiskaLogger.line();
				resolve()
			})
		})
	})
}

module.exports = new GlobalData()