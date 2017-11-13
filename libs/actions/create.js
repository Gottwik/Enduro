// * ———————————————————————————————————————————————————————— * //
// * 	enduro.actions.create
// * ———————————————————————————————————————————————————————— * //
const action = function () {}

action.prototype.action = function (project_name, scaffolding_name) {
	const scaffolder = require(enduro.enduro_path + '/libs/scaffolder')
	return scaffolder.scaffold(project_name, scaffolding_name)
}

module.exports = new action()
