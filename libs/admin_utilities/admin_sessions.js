// * ———————————————————————————————————————————————————————— * //
// * 	Enduro Admin login sessions
// * ———————————————————————————————————————————————————————— * //

var Promise = require('bluebird')

var admin_security = require(ENDURO_FOLDER + '/libs/admin_utilities/admin_security')

var admin_sessions = function () {}

admin_sessions.prototype.create_session = function(req, user) {
	global.admin_sessions = global.admin_sessions || {}

	session = {};
	session.username = user.username
	session.sid = req.sessionID

	global.admin_sessions[req.sessionID] = session

	return session
}

admin_sessions.prototype.get_user_by_session = function(sid) {
	global.admin_sessions = global.admin_sessions || {}

	if(sid in global.admin_sessions) {
		return admin_security.get_user_by_username(global.admin_sessions[sid].username)
	} else {
		return new Promise(function(resolve, reject){ reject() });
	}
}

module.exports = new admin_sessions()