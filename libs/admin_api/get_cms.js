// * ———————————————————————————————————————————————————————— * //
// * 	get cms
// *
// * 	admin api endpoint admin_api/get_cms
// *	@param {string} sid - session id stored in cookie on client
// *	@param {string} filename - filename of the cms file
// *	@return {response} - success boolean and requested data file
// * ———————————————————————————————————————————————————————— * //
var api_call = function () {}

// vendor dependencies
var fs = require('fs')
var glob = require("glob")
var Promise = require('bluebird')

// local dependencies
var flat_file_handler = require(ENDURO_FOLDER + '/libs/flat_utilities/flat_file_handler')
var admin_sessions = require(ENDURO_FOLDER + '/libs/admin_utilities/admin_sessions')

// routed call
api_call.prototype.call = function(req, res, enduro_server) {

	// gets query parameters
	var sid = req.query.sid
	var filename = req.query.filename

	// checks if all required parameters had been received
	if(!sid || !filename) {
		res.send({success: false})
		return
	}

	admin_sessions.get_user_by_session(sid)
		.then((user) => {
			return flat_file_handler.load(filename)
		})
		.then((data) => {

			var context = {}
			context.success = true
			context.page_name = data.$page_name || filename
			context.context = data

			res.send(context)
		})
}

module.exports = new api_call()