// * ———————————————————————————————————————————————————————— * //
// * 	enduro.actions.silent
// * ———————————————————————————————————————————————————————— * //

const action = function () {}

const Promise = require('bluebird')

const logger = require(enduro.enduro_path + '/libs/logger')

action.prototype.action = function () {
	logger.silent()

	return new Promise.resolve()
}

module.exports = new action()
