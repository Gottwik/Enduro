// * ———————————————————————————————————————————————————————— * //
// * 	production start
// * ———————————————————————————————————————————————————————— * //

var action = function () {}

var Promise = require('bluebird')

var enduro_server = require(enduro.enduro_path + '/server')

action.prototype.action = function () {
	return enduro_server.run()
}


module.exports = new action()