// * ———————————————————————————————————————————————————————— * //
// * 	enduro.actions.silent
// * ———————————————————————————————————————————————————————— * //

var action = function () {}

var Promise = require('bluebird')

var logger = require(enduro.enduro_path + '/libs/logger')

action.prototype.action = function () {
	logger.silent()

	return new Promise.resolve()
}

module.exports = new action()
