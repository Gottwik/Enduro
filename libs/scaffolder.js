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
var log_clusters = require(ENDURO_FOLDER + '/libs/log_clusters/log_clusters')

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
		if(enduro_helpers.dirExists(scaffolding_destination) && !flags.force){
			reject('requested directory already exists')
			return kiska_logger.err_block('\tdirectory already existss')
		}

		log_clusters.log('creating_project', {project_name: project_name})

		// Copy files - Without overwriting existing files
		ncp(SCAFFOLDING_SOURCE, scaffolding_destination, {clobber: false}, function (err) {
			if (err) {
				// Something went wrong with the copying
				reject('creating new files failed')
				return kiska_logger.err_block(err)
			}

			// Let the user know the project was created successfully
			log_clusters.log('project_created', {project_name: project_name})

			resolve()
		})
	})
}

module.exports = new scaffolder()