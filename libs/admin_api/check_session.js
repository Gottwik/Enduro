// * ———————————————————————————————————————————————————————— * //
// * 	Check session
// *
// * 	Admin api endpoint admin_api/check_session
// *	@param {Object} sid - Session id stored in cookie on client
// *	@return {response} - Success boolean and user info
// * ———————————————————————————————————————————————————————— * //
var api_call = function () {}

// Vendor dependencies
var Promise = require('bluebird')

// local dependencies
var admin_security = require(ENDURO_FOLDER + '/libs/admin_utilities/admin_security')
var admin_sessions = require(ENDURO_FOLDER + '/libs/admin_utilities/admin_sessions')

// routed call
api_call.prototype.call = function(req, res, enduro_server){

	console.log('checking session')
	// gets session id from query parameters
	var sid = req.query.sid

	// if no session provided
	if(!sid) {
		res.send({success: false, message: 'no sessionid provided'})
	}

	// check for session
	admin_sessions.get_user_by_session(sid)
		.then((user) => {
			res.send({success: true, user: user})
		}, () => {
			res.send({success: false, message: 'session not valid'})
		})

}

module.exports = new api_call()