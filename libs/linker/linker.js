// * ———————————————————————————————————————————————————————— * //
// * 	linker
// *	provides global access to enduro modules and state variables
// * ———————————————————————————————————————————————————————— * //

// vendor depencies
var Promise = require('bluebird')

var enduro_linker = function () {}

var api_links = {
	'temper': '/libs/temper/temper',
	'pagelist_generator': '/libs/build_tools/pagelist_generator',
	'flat': '/libs/flat_db/flat',
	'flat_helpers': '/libs/flat_db/flat_helpers',
	'logger': '/libs/logger',
}

var action_links = {
	'render': '/libs/actions/render',
	'developer_start': '/libs/actions/developer_start',
	'silent': '/libs/actions/silent',
}


// will initialize shared variables that will represent state and configuration
enduro_linker.prototype.init_enduro_linked_configuration = function (project_path, enduro_path) {
	var linker = {}

	// paths for project and enduro
	linker.project_path = project_path
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

	for (action_link in action_links) {
		enduro.actions[action_link] = require(enduro.enduro_path + action_links[action_link]).action
	}
}

module.exports = new enduro_linker()