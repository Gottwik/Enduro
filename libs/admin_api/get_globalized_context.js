// * ———————————————————————————————————————————————————————— * //
// * 	get globalized context
// *	returns object based on globalizer string.
// *	ie. @@global.products.product1 will return the product object itslef
// *
// * 	admin api endpoint admin_api/get_globalized_context
// *	@param {string} sid - session id stored in cookie on client
// *	@param {string} globalizer path - path in global object
// *	@return {response} - success boolean and context object
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

			// clean up string in case there is globalizer handle in front
			globalizer_string = globalizer_string.replace('@@', '').replace('!@', '')

			var output = globalizer_string.split('.').reduce((prev, next) => {
				parent = prev
				return prev[next]
			}, __data)

			res.send(output)
		})
}

module.exports = new api_call()
