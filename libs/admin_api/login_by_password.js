// * ———————————————————————————————————————————————————————— * //
// * 	login by password
// *
// * 	admin api endpoint admin_api/login_by_password
// *	@return {response} - success boolean and session info
// * ———————————————————————————————————————————————————————— * //
var api_call = function () {}

// Vendor dependencies
var Promise = require('bluebird')

// Local dependencies
var admin_security = require(ENDURO_FOLDER + '/libs/admin_utilities/admin_security')
var admin_sessions = require(ENDURO_FOLDER + '/libs/admin_utilities/admin_sessions')
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')

// routed call
api_call.prototype.call = function(req, res, enduro_server){
	console.log(req.query)
	var username = req.query.username
	var password = req.query.password

	kiska_logger.timestamp(username + ' is trying to log in', 'admin_login')

	if(!password || !username) {
		res.send({success: false})
		return
	}

	admin_security.login_by_password(username, password)
		.then((user) => {
			return admin_sessions.create_session(req, user)
		}, (err) => {
			res.send({
				success: false,
			})
			throw new Error('abort promise chain')
			return
		})
		.then((session) => {
			res.send(session)
		}, () => {})
}

module.exports = new api_call()