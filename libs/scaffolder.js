// * ———————————————————————————————————————————————————————— * //
// * 	scaffolder
// *	handles new project creation
// *	gets whats after '$ enduro create' as @args
// * ———————————————————————————————————————————————————————— * //
var scaffolder = function () {}

// vendor variables
var Promise = require('bluebird')
var ncp = require('ncp').ncp // Handles copying files

// local variables
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')
var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')

// constants
var SCAFFOLDING_SOURCE = ENDURO_FOLDER + '/scaffolding' // source of the scaffolding - directory where enduro is installed

// * ———————————————————————————————————————————————————————— * //
// * 	scaffold
// *
// *	copies required files into new project
// *	@param {array} args - args[0] stores the desired name of the new project
// *	@return {Promise} - promise with no content. resolve if login was successfull
// * ———————————————————————————————————————————————————————— * //
scaffolder.prototype.scaffold = function(args){
	return new Promise(function(resolve, reject){

		// No project name given
		if(!args.length){
			kiska_logger.err('\nProvide project name as \n\n\t$ enduro create projectname\n')
			return reject('no project name was specified')
		}

		// Stores project name
		var project_name = args[0]

		// Destination directory
		var scaffolding_destination = CMD_FOLDER + '/' + project_name

		// Reject if directory already exists
		if(enduro_helpers.dirExists(scaffolding_destination)){
			reject('requested directory already exists')
			return kiska_logger.err_block('\tdirectory already existss')
		}

		kiska_logger.init('ENDURO - CREATING PROJECT')
		kiska_logger.log('Creating new project ' + project_name)
		kiska_logger.line()

		// Copy files - Without overwriting existing files
		ncp(SCAFFOLDING_SOURCE, scaffolding_destination, {clobber: false}, function (err) {
			if (err) {
				// Something went wrong with the copying
				reject('creating new files failed')
				return kiska_logger.err_block(err)
			}

			// Let the user know the project was created successfully
			kiska_logger.log('Project created successfully.')
			kiska_logger.line()
			kiska_logger.log('Dont forget to cd into project with', true)
			kiska_logger.tablog('$ cd ' + project_name, true)
			kiska_logger.log('Then run', true)
			kiska_logger.tablog('$ enduro', true)
			kiska_logger.end()
			resolve()
		})
	})
}

module.exports = new scaffolder()