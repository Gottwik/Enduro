// * ———————————————————————————————————————————————————————— * //
// * 	enduro.actions.create
// * ———————————————————————————————————————————————————————— * //

var action = function () {}

action.prototype.action = function (project_name, scaffolding_name) {
	var scaffolder = require(enduro.enduro_path + '/libs/scaffolder')
	return scaffolder.scaffold(project_name, scaffolding_name)
}

module.exports = new action()
