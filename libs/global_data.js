
// * ———————————————————————————————————————————————————————— * //
// * 	Global Data
// *	Loads global data - data to be used on all templates
// *	Good for shared resources - news, products...
// *	Loads .js files from /cms/global folder
// * ———————————————————————————————————————————————————————— * //


var Promise = require('bluebird')
var fs = require('fs')
var async = require("async")
var kiskaLogger = require('./kiska_logger')
var enduro_helpers = require('./enduro_helpers')
var glob = require("glob")
var zebra_loader = require('./zebra_loader')
var extend = require('extend')

var DATA_PATH = process.cwd() + '/cms/global/*.js'

var GlobalData = function () {}

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
				
				// Loads the file
				var data = {}
				if(enduro_helpers.fileExists(file)){
					var data = zebra_loader.load(file)
				}

				// Extends global data with currently loaded data
				extend(true, __data, data)

				kiskaLogger.twolog('global ' + filename, 'loaded')
				callback()

			}, function(){
				// After all global files are loaded
				kiskaLogger.line();
				resolve()
			})
		})
	})
}

module.exports = new GlobalData()