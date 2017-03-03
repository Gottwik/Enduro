// * ———————————————————————————————————————————————————————— * //
// * 	render
// *	renders all the static files - no server started
// * ———————————————————————————————————————————————————————— * //

var silent_action = function () {}

var Promise = require('bluebird')

var logger = require(enduro.enduro_path + '/libs/logger')


silent_action.prototype.action = function (callback, dont_do_juice_pull) {

	logger.silent()

	return new Promise.resolve()

}


module.exports = new silent_action()