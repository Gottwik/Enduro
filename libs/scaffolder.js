// * ———————————————————————————————————————————————————————— * //
// * 	scaffolder
// *	handles new project creation
// *	gets whats after '$ enduro create' as @args
// * ———————————————————————————————————————————————————————— * //
var scaffolder = function () {}

// vendor variables
var Promise = require('bluebird')
var ncp = require('ncp').ncp // Handles copying files
var path = require('path')

// local variables
var logger = require(enduro.enduro_path + '/libs/logger')
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
var log_clusters = require(enduro.enduro_path + '/libs/log_clusters/log_clusters')
var glob = require('glob')

// constants
var DEFAULT_SCAFFOLDING_NAME = 'minimalistic'

// * ———————————————————————————————————————————————————————— * //
// * 	scaffold
// *
// *	copies required files into new project
// *	@param {string} project_name
// *	@param {string} scaffolder_name - defines which scaffolding to choose
// *	@return {Promise} - promise with no content. resolve if login was successfull
// * ———————————————————————————————————————————————————————— * //
scaffolder.prototype.scaffold = function (project_name, scaffolding_name) {
	return new Promise(function (resolve, reject) {

		if (!project_name) {
			return reject({ message: 'missing project name' })
		}

		var scaffolding_path = get_scaffolding_path_by_name(scaffolding_name)

		if (scaffolding_path == -1) {
			return reject()
		}

		// Destination directory
		var scaffolding_destination = path.join(enduro.project_path, project_name)

		// Reject if directory already exists
		if (flat_helpers.dir_exists_sync(scaffolding_destination) && !enduro.flags.force) {
			reject('requested directory already exists')
			return logger.err_block('\tdirectory already exists')
		}
		log_clusters.log('creating_project', {project_name: project_name})

		// Copy files - Without overwriting existing files
		ncp(scaffolding_path, scaffolding_destination, { clobber: false }, function (err) {
			if (err) {
				// Something went wrong with the copying
				reject('creating new files failed')
				return logger.err_block(err)
			}

			// Let the user know the project was created successfully
			log_clusters.log('project_created', {project_name: project_name})

			resolve()
		})
	})
}

function get_scaffolding_path_by_name (scaffolding_name) {

	scaffolding_name = scaffolding_name || DEFAULT_SCAFFOLDING_NAME

	var scaffolding_path = path.join(enduro.enduro_path, 'scaffolding', scaffolding_name)
	if (!flat_helpers.dir_exists_sync(scaffolding_path)) {
		non_existent_scaffoling_logout(scaffolding_name)
		return -1
	}

	return scaffolding_path
}

function non_existent_scaffoling_logout (scaffolding_name) {
	logger.err_blockStart('Scaffolding does not exist')
	logger.err('Scaffolding with name ' + scaffolding_name + ' does not exist')
	logger.err('\nChoose from these scaffoldings:\n')

	var scaffoldings = glob.sync(path.join(enduro.enduro_path, 'scaffolding', '*'))
	for (var s in scaffoldings) {
		logger.err('\t' + scaffoldings[s].match(/\/([^\/]*)$/)[1])
	}

	logger.err('\n')
	logger.err_blockEnd()
}

module.exports = new scaffolder()
