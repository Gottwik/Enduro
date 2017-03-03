// * ———————————————————————————————————————————————————————— * //
// * 	Check session
// *
// * 	Admin api endpoint admin_api/check_session
// *	@param {string} sid - Session id stored in cookie on client
// *	@return {response} - Success boolean and user info
// * ———————————————————————————————————————————————————————— * //
var api_call = function () {}

// local dependencies
var admin_sessions = require(enduro.enduro_path + '/libs/admin_utilities/admin_sessions')
var logger = require(enduro.enduro_path + '/libs/logger')

// routed call
api_call.prototype.call = function (req, res, enduro_server) {

	// gets session id from query parameters
	var sid = req.query.sid

	// if no session provided
	if (!sid) {
		res.send({success: false, message: 'no sessionid provided'})
		return logger.err('login with no session id')
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
