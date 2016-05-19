// * ———————————————————————————————————————————————————————— * //
// * 	Scaffolder
// *	Handles new project creation
// *	Gets whats after enduro create as @args
// * ———————————————————————————————————————————————————————— * //

var Promise = require('bluebird');

// Handles copying files
var ncp = require('ncp').ncp;

var kiska_logger = require('./kiska_logger')
var enduro_helpers = require('./flat_utilities/enduro_helpers')

var Scaffolder = function () {}

Scaffolder.prototype.scaffold = function(args){
	return new Promise(function(resolve, reject){

		// No project name given
		if(!args.length){
			reject('no project name was specified')
			return kiska_logger.err('\nProvide project name as \n\n\t$ enduro create projectname\n')
		}

		// Stores project name
		var projectName = args[0]
		// Source of the scaffolding - Directory where enduro is installed
		var source = __dirname + '/../scaffolding'

		// Destination directory
		var destination = CMD_FOLDER + '/' + projectName

		// Reject if directory already exists
		if(enduro_helpers.dirExists(destination)){
			reject('requested directory already exists')
			return kiska_logger.errBlock('\tdirectory already exists')
		}

		kiska_logger.init('ENDURO - CREATING PROJECT')
		kiska_logger.log('Creating new project ' + projectName)
		kiska_logger.line()

		// Copy files - Without overwriting existing files
		ncp(source, destination, {clobber: false}, function (err) {
			if (err) {
				// Something went wrong with the copying
				reject('creating new files failed')
				return kiska_logger.errBlock(err);
			}

			// Let the user know the project was created successfully
			kiska_logger.log('Project created successfully.')
			kiska_logger.line()
			kiska_logger.log('Dont forget to cd into project with', true)
			kiska_logger.tablog('$ cd ' + projectName, true)
			kiska_logger.log('Then run', true)
			kiska_logger.tablog('$ enduro', true)
			kiska_logger.end()
			resolve()
		});
	})
}

module.exports = new Scaffolder()