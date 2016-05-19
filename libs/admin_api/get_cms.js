var fs = require('fs')
var glob = require("glob")
var Promise = require('bluebird')

var flat_file_handler = require(ENDURO_FOLDER + '/libs/flat_utilities/flat_file_handler')
var admin_sessions = require(ENDURO_FOLDER + '/libs/admin_utilities/admin_sessions')

var api_call = function () {}

api_call.prototype.call = function(req, res, enduro_server){
	admin_sessions.get_user_by_session(req.query.sid)
		.then((user) => {
			return flat_file_handler.load(req.query.filename)
		})
		.then((data) => {
			res.send(data)
		})
}

module.exports = new api_call()