// * ———————————————————————————————————————————————————————— * //
// * 	Components handler
// *	Loads components. Note that even if component is stored
// *	in subdirectory, it's name will be just the file name
// * ———————————————————————————————————————————————————————— * //
var components_handler = function () {}

// vendor dependencies
var Promise = require('bluebird')
var fs = require('fs')
var async = require("async")
var glob = require("glob")

// local dependencies
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')

// constants
var COMPONENTS_PATH = CMD_FOLDER + '/components/**/*.hbs'


// * ———————————————————————————————————————————————————————— * //
// * 	read components
// * 	reads all components from /components folder
// *
// *	@return {promise} - empty promise
// * ———————————————————————————————————————————————————————— * //
components_handler.prototype.read_components = function(){
	return new Promise(function(resolve, reject){

		// fetches the files
		glob( COMPONENTS_PATH , function (err, files) {
			if (err) {
				kiska_logger.err_block(err)
				return reject()
			}

			// async goes through all files
			async.each(files, function(file, callback) {

				// stores file name and file extension
				var fileReg = file.match(/([^\\/]+)\.([^\\/]+)$/)
				var filename = fileReg[1]
				var fileext = fileReg[2]

				// reads the file. @data stores the component's raw contents
				fs.readFile(file, 'utf8', function (err, data) {
					if (err) {
						kiska_logger.err_block(err)
						return reject(err)
					}

					// register the component
					__templating_engine.registerPartial(filename.toLowerCase(), data)
					kiska_logger.twolog('component ' + filename, 'registered', 'enduro_render_events')
					callback()
				})
			}, function(){

				// after all components are loaded
				kiska_logger.line('enduro_render_events');
				resolve()
			})
		})
	})
}

module.exports = new components_handler()