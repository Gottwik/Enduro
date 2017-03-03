// * ———————————————————————————————————————————————————————— * //
// * 	stop server
// * ———————————————————————————————————————————————————————— * //

var silent_action = function () {}

var Promise = require('bluebird')

var logger = require(enduro.enduro_path + '/libs/logger')
var enduro_server = require(enduro.enduro_path + '/server')
var gulp = require(enduro.enduro_path + '/gulpfile')

silent_action.prototype.action = function (cb) {
	gulp.start('browser_sync_stop')
	return enduro_server.stop(cb)
}


module.exports = new silent_action()