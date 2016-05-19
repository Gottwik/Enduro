// * ———————————————————————————————————————————————————————— * //
// * 	Enduro Admin login sessions
// * ———————————————————————————————————————————————————————— * //

var Promise = require('bluebird')

var admin_security = require(ENDURO_FOLDER + '/libs/admin_utilities/admin_security')
var flat_file_handler = require(ENDURO_FOLDER + '/libs/flat_utilities/flat_file_handler')

var admin_sessions = function () {}

admin_sessions.prototype.create_session = function(req, user) {
	global.admin_sessions_store = global.admin_sessions_store || {}

	session = {};
	session.success = true
	session.username = user.username
	session.sid = req.sessionID

	global.admin_sessions_store[req.sessionID] = session

	return session
}

admin_sessions.prototype.get_user_by_session = function(sid) {
	global.admin_sessions_store = global.admin_sessions_store || {}


	if(sid in global.admin_sessions_store) {
		return admin_security.get_user_by_username(global.admin_sessions_store[sid].username)
	} else {
		return new Promise(function(resolve, reject){ reject() });
	}
}

module.exports = new admin_sessions()