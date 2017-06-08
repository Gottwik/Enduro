// * ———————————————————————————————————————————————————————— * //
// *	enduro.js
// *	Minimalistic, lean & mean, node.js cms
// * ———————————————————————————————————————————————————————— * //

// vendor dependencies
const Promise = require('bluebird')

// local dependencies
const linker = require('./libs/linker/linker')

const enduro_instance = function () {}

// * ———————————————————————————————————————————————————————— * //
// * 	quick_init
// *
// * 	sets up limited global variables such as enduro's location
// *	this is used mainly to speed up tests where all enduro's variables
// *	are not needed
// *	@return nothing
// * ———————————————————————————————————————————————————————— * //
enduro_instance.prototype.quick_init = function () {

	// exposes enduro api, state, variables and configuration as public variable
	global.enduro = linker.init_enduro_linked_configuration(process.cwd(), __dirname)

	return this // returns self chain-style in case the full init is needed later
}

// * ———————————————————————————————————————————————————————— * //
// * 	init
// *
// * 	- sets up global enduro variables
// *	- exposes enduro's api to client project
// *	- exposes enduro's main action
// *	- read and stores project-specific configuration
// *	@return {Promise} - resolves after enduro is ready to start
// * ———————————————————————————————————————————————————————— * //
enduro_instance.prototype.init = function (project_path) {

	const new_project_path = project_path || process.cwd()

	// exposes enduro api, state, variables and configuration as public variable
	global.enduro = linker.init_enduro_linked_configuration(new_project_path, __dirname)

	// exposes enduro's api libraries and action functions
	linker.expose_enduro_api()

	// these two are asynchronous, so let's do them in parallel
	return Promise.all([
		linker.expose_enduro_actions(), // actions are stored in /libs/actions/
		linker.read_config()
	])
}

module.exports = new enduro_instance()
