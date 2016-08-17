// * ———————————————————————————————————————————————————————— * //
// * 	get globalizer options
// *
// * 	admin api endpoint admin_api/get_globalizer_options
// *	@param {string} sid - session id stored in cookie on client
// *	@param {string} globalizer path - path in global object
// *	@return {response} - success boolean and array with options
// * ———————————————————————————————————————————————————————— * //
var api_call = function () {}

// local dependencies
var admin_sessions = require(ENDURO_FOLDER + '/libs/admin_utilities/admin_sessions')

// routed call
api_call.prototype.call = function (req, res, enduro_server) {

	// gets query parameters
	var sid = req.query.sid
	var globalizer_string = req.query.globalizer_string

	// checks if all required parameters had been received
	if (!sid || !globalizer_string) {
		res.send({success: false})
		return
	}

	admin_sessions.get_user_by_session(sid)
		.then((user) => {
			var parent

			globalizer_options = Object.keys(parent).map((option) => {
				return '@@' + globalizer_string.split('.').slice(0, -1).join('.') + '.' + option
			})

			res.send(globalizer_options)
		})
}

module.exports = new api_call()
