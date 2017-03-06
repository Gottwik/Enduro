// * ———————————————————————————————————————————————————————— * //
// *	enduro.js
// *	Minimalistic, lean & mean, node.js cms
// * ———————————————————————————————————————————————————————— * //

// vendor dependencies
var path = require('path')
var Promise = require('bluebird')

var linker = require('./libs/linker/linker')

var enduro_instance = function () {}

enduro_instance.prototype.quick_init = function () {

	// exposes enduro api, state, variables and configuration as public variable
	// to cut down on complexity when developing enduro projects
	global.enduro = linker.init_enduro_linked_configuration(process.cwd(), __dirname)

	return this
}


enduro_instance.prototype.init = function (project_path) {

	var new_project_path = project_path || process.cwd()

	// exposes enduro api, state, variables and configuration as public variable
	// to cut down on complexity when developing enduro projects
	global.enduro = linker.init_enduro_linked_configuration(new_project_path, __dirname)

	// exposes enduro's api libraries and action functions
	linker.expose_enduro_api()
	return Promise.all([
		linker.expose_enduro_actions(),
		linker.read_config()
	])
}


module.exports = new enduro_instance()
