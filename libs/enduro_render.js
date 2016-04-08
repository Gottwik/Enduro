
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

var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')
var flat_file_handler = require(ENDURO_FOLDER + '/libs/flat_utilities/flat_file_handler')
var babel = require(ENDURO_FOLDER + '/libs/babel/babel')


// Current terminal window
var DATA_PATH = CMD_FOLDER;

// Goes through the pages and renders them
EnduroRender.prototype.render = function(){
	return new Promise(function(resolve, reject){
		glob(DATA_PATH + '/pages/**/*.hbs', function (err, files) {
			if (err) { return console.log(err) }

			babel.getcultures()
				.then(function(cultures){
					async.each(files, function(file, callback) {
						async.each(cultures, function(culture, cb){
							renderFile(file, culture, cb)
						}, callback)
					}, function(){
						resolve()
					})
				})
		})
	})
}

// Renders individual files
function renderFile(file, culture, callback){

	// Stores file name and extension
	// Note that subdirecotries are included in the name
	var fileReg = file.match(/pages\/(.*)\.([^\\/]+)$/)
	var filename = fileReg[1]
	var fileext = fileReg[2]

	// where will the generated page end
	var endpath = culture + '/' + filename

	// Attempts to read the file
	fs.readFile(file, 'utf8', function (err,data) {
		if (err) { return kiska_logger.errBlock(err) }

		// Creates a template
		var template = __templating_engine.compile(data)

		// Loads context if cms file with same name exists
		flat_file_handler.load(filename)
			.then((context) => {
				// If global data exists extends the context with it
				if(typeof __data !== 'undefined'){
					extend(true, context, __data)
				}

				// Renders the template with the culturalized context
				var output = template(babel.culturalize(context, culture))

				// Makes sure the target directory exists
				enduro_helpers.ensureDirectoryExistence(DATA_PATH + '/_src/' + endpath)
					.then(function(){
						// Attempts to export the file
						fs.writeFile(DATA_PATH + '/_src/' + endpath + '.html', output, function(err) {
							if (err) { return kiska_logger.errBlock(err) }

							kiska_logger.twolog('page ' + endpath, 'created')
							callback()
						})
					})
			},() => {
				console.log('something went wrong attempting to locate file: ' + filename)
			})

	})
}

module.exports = new EnduroRender()