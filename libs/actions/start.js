// * ———————————————————————————————————————————————————————— * //
// * 	production start
// * ———————————————————————————————————————————————————————— * //

var developer_start_action = function () {}

var Promise = require('bluebird')

var enduro_server = require(enduro.enduro_path + '/server')

developer_start_action.prototype.action = function () {
	return enduro_server.run()
}


module.exports = new developer_start_action()