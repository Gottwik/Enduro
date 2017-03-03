// * ———————————————————————————————————————————————————————— * //
// * 	login by password
// *
// * 	admin api endpoint admin_api/login_by_password
// *	@return {response} - success boolean and session info
// * ———————————————————————————————————————————————————————— * //
var api_call = function () {}

// Local dependencies
var admin_security = require(enduro.enduro_path + '/libs/admin_utilities/admin_security')
var admin_sessions = require(enduro.enduro_path + '/libs/admin_utilities/admin_sessions')
var logger = require(enduro.enduro_path + '/libs/logger')

// routed call
api_call.prototype.call = function (req, res, enduro_server) {
	var username = req.query.username
	var password = req.query.password

	logger.timestamp(username + ' is trying to log in', 'admin_login')

	if (!password || !username) {
		res.send({success: false})
		return
	}

	admin_security.login_by_password(username, password)
		.then((user) => {
			logger.timestamp(username + ' successfully logged in', 'admin_login')
			return admin_sessions.create_session(req, user)
		}, () => {
			logger.timestamp(username + ' failed to log in', 'admin_login')
			res.send({
				success: false,
			})
			throw new Error('abort promise chain')
		})
		.then((session) => {
			logger.timestamp('session created for ' + username, 'admin_login')
			res.send(session)
		}, () => {})
}

module.exports = new api_call()
