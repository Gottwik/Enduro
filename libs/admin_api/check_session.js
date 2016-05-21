// * ———————————————————————————————————————————————————————— * //
// * 	Check session
// *
// * 	Admin api endpoint admin_api/check_session
// *	@param {string} sid - Session id stored in cookie on client
// *	@return {response} - Success boolean and user info
// * ———————————————————————————————————————————————————————— * //
var api_call = function () {}

// Vendor dependencies
var Promise = require('bluebird')

// local dependencies
var admin_security = require(ENDURO_FOLDER + '/libs/admin_utilities/admin_security')
var admin_sessions = require(ENDURO_FOLDER + '/libs/admin_utilities/admin_sessions')
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')

// routed call
api_call.prototype.call = function(req, res, enduro_server){

	// gets session id from query parameters
	var sid = req.query.sid

	// if no session provided
	if(!sid) {
		res.send({success: false, message: 'no sessionid provided'})
		return kiska_logger.err('login with no session id')
	}

	// check for session
	admin_sessions.get_user_by_session(sid)
		.then((user) => {
			res.send({success: true, user: user})
		}, (message) => {
			res.send({success: false, message: message})
		})

}

module.exports = new api_call()