// * ———————————————————————————————————————————————————————— * //
// * 	stop server
// * ———————————————————————————————————————————————————————— * //

var action = function () {}

var Promise = require('bluebird')

var logger = require(enduro.enduro_path + '/libs/logger')
var enduro_server = require(enduro.enduro_path + '/server')
var gulp = require(enduro.enduro_path + '/gulpfile')

action.prototype.action = function () {
	return gulp.start_promised('browser_sync_stop')
		.then(() => {
			return enduro_server.stop()
		})
}


module.exports = new action()