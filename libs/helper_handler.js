var Promise = require('bluebird');
var fs = require('fs')
var async = require("async")
var glob = require("glob")
var kiskaLogger = require('./kiska_logger')

var COMPONENTS_PATH = __dirname + '/../hbs_helpers/**/*.js'

var HelperHandler = function () {}

HelperHandler.prototype.readHelpers = function(){
	return new Promise(function(resolve, reject){
		glob( COMPONENTS_PATH , function (err, files) {
			if (err) { return console.log(err) }
			async.each(files, function(file, callback) {
				var fileReg = file.match(/([^\\/]+)\.([^\\/]+)$/)
				var filename = fileReg[1]
				var fileext = fileReg[2]
				require('../hbs_helpers/'+filename+'.'+fileext)
				kiskaLogger.twolog('helper ' + filename, 'registered')
				callback()
			}, function(){
				kiskaLogger.line();
				resolve()
			})
		})
	})
}

module.exports = new HelperHandler()