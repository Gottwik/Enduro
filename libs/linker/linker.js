// * ———————————————————————————————————————————————————————— * //
// * 	linker
// *	provides global access to enduro modules and state variables
// * ———————————————————————————————————————————————————————— * //

// vendor depencies
var Promise = require('bluebird')
var glob = require('glob-promise')
var path = require('path')

var enduro_linker = function () {}

var api_links = {
	'temper': '/libs/temper/temper',
	'pagelist_generator': '/libs/build_tools/pagelist_generator',
	'flat': '/libs/flat_db/flat',
	'flat_helpers': '/libs/flat_db/flat_helpers',
	'logger': '/libs/logger',
}

// will initialize shared variables that will represent state and configuration
enduro_linker.prototype.init_enduro_linked_configuration = function (project_path, enduro_path) {
	var linker = {}

	// paths for project
	linker.project_path = project_path

	// path to enduro (taken from where)
	linker.enduro_path = enduro_path

	// stores templating engine for possible future replacement
	// promised handlebars allows for asynchronous calls inside helpers
	linker.templating_engine = require('promised-handlebars')(require('handlebars'), { Promise: Promise })

	// creates an empty object to store precomputed data
	linker.precomputed_data = {}

	// initializes empty variables
	linker.development_firstload_url = ''

	// creates config objects
	linker.config = {}
	linker.config.secret = {}

	// creates flags object
	linker.flags = {}

	// creates global cms data object
	linker.cms_data = {}
	linker.cms_data.global = {}

	return linker
}

// will require the exposed modules one by one and return an object with them
enduro_linker.prototype.expose_enduro_api = function () {

	enduro.api = {}

	for (api_link in api_links) {
		enduro.api[api_link] = require(enduro.enduro_path + api_links[api_link])
	}
}

// will expose all the enduro.js contextless actions
enduro_linker.prototype.expose_enduro_actions = function () {

	enduro.actions = {}

	return glob(enduro.enduro_path + '/libs/actions/*.js')
		.then((action_paths) => {
			for (action_path of action_paths) {
				var action_name = path.basename(action_path, '.js')
				enduro.actions[action_name] = require(action_path).action
			}
		})

}

// will expose all the enduro.js contextless actions
enduro_linker.prototype.read_config = function () {
	return require(enduro.enduro_path + '/libs/configuration/enduro_configurator').read_config()
		.then(() => {

			// stores filesystem
			try {
				enduro.filesystem = require(path.join(enduro.enduro_path, 'libs', 'remote_tools', 'filesystems', enduro.config.filesystem + '_filesystem.js'))
			} catch (e) {
				if (e.code == 'MODULE_NOT_FOUND') {
					try {
						enduro.filesystem = require(path.join(enduro.project_path, 'node_modules', enduro.config.filesystem))
					} catch (e) {
						console.log(e)
						if (e.code == 'MODULE_NOT_FOUND') {
							console.log('module `' + enduro.config.filesystem + '` not found. Did you install it?')
							process.exit()
						}
					}
				}
			}
			enduro.filesystem.init()
		})
}

module.exports = new enduro_linker()
