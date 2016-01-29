var Promise = require('bluebird');
var fs = require('fs')
var async = require("async")
var glob = require("glob")
var mkdirp = require('mkdirp');
var extend = require('extend')

var k7_helpers = require('./k7_helpers')
var kiskaLogger = require('./kiska_logger')

var SevenRender = function () {}

// Current terminal window
var DATA_PATH = process.cwd();

SevenRender.prototype.render = function(){
	return new Promise(function(resolve, reject){
		glob(DATA_PATH + '/pages/**/*.hbs', function (err, files) {
			if (err) { return console.log(err) }

			async.each(files, function(file, callback) {
				render(file, callback)
			}, function(){
				resolve()
			})
		})
	})
}

function render(file, callback){
	var fileReg = file.match(/pages\/(.*)\.([^\\/]+)$/)
	var filename = fileReg[1]
	var fileext = fileReg[2]

	fs.readFile(file, 'utf8', function (err,data) {
		if (err) { return console.log(err) }

		var template = __templating_engine.compile(data)
		var context = {}
		if(k7_helpers.fileExists(DATA_PATH + '/cms/'+filename+'.js')){
			context = require(DATA_PATH + '/cms/'+filename+'.js')
		}
		if(typeof __data !== 'undefined'){
			extend(true, context, __data)
		}

		var output = template(context)

		ensureDirectoryExistence(DATA_PATH + '/_src/' + filename)
			.then(function(){
				fs.writeFile(DATA_PATH + '/_src/' + filename + '.html', output, function(err) {
					if (err) { return console.log(err) }

					kiskaLogger.twolog('page ' + filename, 'created')
					callback()
				})		
			})

	})
}

function ensureDirectoryExistence(filePath) {
	filePath = filePath.match(/^(.*)\/.*$/)[1]
	return new Promise(function(resolve, reject){
		mkdirp(filePath, function(err) { 
			if(err){ reject() }
			resolve();

		})
	})
}

module.exports = new SevenRender()