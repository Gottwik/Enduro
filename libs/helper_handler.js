var Promise = require('bluebird');
var fs = require('fs')
var async = require("async")
var glob = require("multi-glob").glob;
var kiska_logger = require('./kiska_logger')

var ENDURO_HELPERS_PATH = __dirname + '/../hbs_helpers/**/*.js'
var PROJECT_HELPERS_PATH = CMD_FOLDER + '/assets/hbs_helpers/**/*.js'

var HelperHandler = function () {}

HelperHandler.prototype.read_helpers = function(){
	return new Promise(function(resolve, reject){
		glob( [ENDURO_HELPERS_PATH, PROJECT_HELPERS_PATH] , function (err, files) {
			if (err) { return console.log(err) }
			async.each(files, function(file, callback) {
				var fileReg = file.match(/([^\\/]+)\.([^\\/]+)$/)
				var filename = fileReg[1]
				var fileext = fileReg[2]
				require(file)
				kiska_logger.twolog('helper ' + filename, 'registered')
				callback()
			}, function(){
				kiska_logger.line();
				resolve()
			})
		})
	})
}

module.exports = new HelperHandler()
