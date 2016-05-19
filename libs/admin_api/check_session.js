var Promise = require('bluebird')

var admin_security = require(ENDURO_FOLDER + '/libs/admin_utilities/admin_security')
var admin_sessions = require(ENDURO_FOLDER + '/libs/admin_utilities/admin_sessions')

var api_call = function () {}

api_call.prototype.call = function(req, res, query){

	var sid = req.query.sid

	if(!sid) {
		res.send({success: false, message: 'no sessionid provided'})
	}

	admin_sessions.get_user_by_session(sid)
		.then((user) => {
			console.log('session login successfull')
			res.send({success: true, user: user})
		}, () => {
			console.log('session login failed')
			res.send({success: false, message: 'session not valid'})
		})

}

module.exports = new api_call()