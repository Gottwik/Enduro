// * ———————————————————————————————————————————————————————— * //
// * 	save cms
// *
// * 	admin api endpoint admin_api/save_cms
// *	@param {string} sid - session id stored in cookie on client
// *	@param {string} filename - name of the cms file. relative to cms/
// *	@param {string} content - content of the cms updated file - will be converted to js object and formated upon save
// *	@return {response} - success boolean and saved cms' file content
// * ———————————————————————————————————————————————————————— * //
var api_call = function () {}

// Vendor dependencies
var fs = require('fs')
var glob = require("glob")
var Promise = require('bluebird')

// local dependencies
var flat_file_handler = require(ENDURO_FOLDER + '/libs/flat_utilities/flat_file_handler')
var admin_sessions = require(ENDURO_FOLDER + '/libs/admin_utilities/admin_sessions')

// routed call
api_call.prototype.call = function(req, res, enduro_server){

	// gets parameters from query
	var sid = req.query.sid
	var filename = req.query.filename
	var content = req.query.content

	// makes sure all required query parameters were sent
	if(!sid || !filename || !content) {
		res.send({success: false, message: 'Parameters not provided'})
		return kiska_logger.err('parameters not provided')
	}

	admin_sessions.get_user_by_session(sid)
		.then((user) => {
			return flat_file_handler.save_by_string(filename, content)
		})
		.then((data) => {
			res.send(data)
		})

	// Re-renders enduro - essential to publishing the change
	enduro_server.enduroRefresh(() => {})
}

module.exports = new api_call()