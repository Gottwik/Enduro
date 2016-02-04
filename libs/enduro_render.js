
// * ———————————————————————————————————————————————————————— * //
// * 	Enduro Render
// *	Goes throught all the pages and renders them with handlebars
// * ———————————————————————————————————————————————————————— * //

var EnduroRender = function () {}

var Promise = require('bluebird')
var fs = require('fs')
var async = require("async")
var glob = require("glob")
var extend = require('extend')
var enduro_helpers = require('./enduro_helpers')
var kiskaLogger = require('./kiska_logger')
var zebra_loader = require('./zebra_loader')

// Current terminal window
var DATA_PATH = process.cwd();

// Goes through the pages and renders them
EnduroRender.prototype.render = function(){
	return new Promise(function(resolve, reject){
		glob(DATA_PATH + '/pages/**/*.hbs', function (err, files) {
			if (err) { return console.log(err) }

			async.each(files, function(file, callback) {
				renderFile(file, callback)
			}, function(){
				resolve()
			})
		})
	})
}

// Renders individual files 
function renderFile(file, callback){

	// Stores file name and extension
	// Note that subdirecotries are included in the name
	var fileReg = file.match(/pages\/(.*)\.([^\\/]+)$/)
	var filename = fileReg[1]
	var fileext = fileReg[2]

	// Attempts to read the file
	fs.readFile(file, 'utf8', function (err,data) {
		if (err) { return kiskaLogger.errBlock(err) }

		// Creates a template
		var template = __templating_engine.compile(data)

		// Loads context if cms file with same name exists 
		var context = {}
		if(enduro_helpers.fileExists(DATA_PATH + '/cms/'+filename+'.js')){
			context = zebra_loader.load(DATA_PATH + '/cms/'+filename+'.js')
		}

		// If global data exists extends the context with it
		if(typeof __data !== 'undefined'){
			extend(true, context, __data)
		}

		// Renders the template with the context
		var output = template(context)

		// Makes sure the target directory exists
		enduro_helpers.ensureDirectoryExistence(DATA_PATH + '/_src/' + filename)
			.then(function(){
				// Attempts to export the file
				fs.writeFile(DATA_PATH + '/_src/' + filename + '.html', output, function(err) {
					if (err) { return kiskaLogger.errBlock(err) }

					kiskaLogger.twolog('page ' + filename, 'created')
					callback()
				})		
			})
	})
}

module.exports = new EnduroRender()