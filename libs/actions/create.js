// * ———————————————————————————————————————————————————————— * //
// * 	enduro.actions.create
// * ———————————————————————————————————————————————————————— * //

var developer_start_action = function () {}

// vendor dependencies
var Promise = require('bluebird')

developer_start_action.prototype.action = function (project_name, scaffolding_name) {
	var scaffolder = require(enduro.enduro_path + '/libs/scaffolder')
	return scaffolder.scaffold(project_name, scaffolding_name)
}

module.exports = new developer_start_action()