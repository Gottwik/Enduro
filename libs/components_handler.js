var Promise = require('bluebird');
var fs = require('fs')
var async = require("async")
var glob = require("glob")
var kiskaLogger = require('./kiska_logger')

var COMPONENTS_PATH = process.cwd() + '/components/**/*.hbs'

var ComponentHandler = function () {}

ComponentHandler.prototype.readComponents = function(){
	return new Promise(function(resolve, reject){
		glob( COMPONENTS_PATH , function (err, files) {
			if (err) { return console.log(err) }
			async.each(files, function(file, callback) {
				var fileReg = file.match(/([^\\/]+)\.([^\\/]+)$/)
				var filename = fileReg[1]
				var fileext = fileReg[2]
				fs.readFile(file, 'utf8', function (err,data) {
					if (err) { reject(err) }
					kiskaLogger.twolog('component ' + filename, 'registered')
					__templating_engine.registerPartial(filename.toLowerCase(), data)
					callback()
				})
			}, function(){
				kiskaLogger.line();
				resolve()
			})
		})
	})
}

module.exports = new ComponentHandler()