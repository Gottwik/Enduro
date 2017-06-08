// * ———————————————————————————————————————————————————————— * //
// * 	enduro.actions.stop_server
// * ———————————————————————————————————————————————————————— * //

var action = function () {}

var enduro_server = require(enduro.enduro_path + '/libs/enduro_server/enduro_server')
var gulp_tasks = require(enduro.enduro_path + '/libs/build_tools/gulp_tasks')

action.prototype.action = function () {
	return gulp_tasks.start_promised('browser_sync_stop')
		.then(() => {
			return enduro_server.stop()
		})
}

module.exports = new action()
