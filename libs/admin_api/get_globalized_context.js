// * ———————————————————————————————————————————————————————— * //
// * 	get globalized context
// *	returns object based on globalizer string. this is useful for the templatitator control.
// *	ie. @@global.products.product1 will return the product object itself
// *
// * 	admin api endpoint admin_api/get_globalized_context
// *	@param {string} sid - session id stored in cookie on client
// *	@param {string} globalizer_string - path to the global object prefixed by '@@'
// *	@param {string} page_path - path to the current cms page. Will try to find the object in the local context if it was not found in the global context
// *	@return {response} - success boolean and context object
// * ———————————————————————————————————————————————————————— * //
var api_call = function () {}

// local dependencies
var admin_sessions = require(enduro.enduro_path + '/libs/admin_utilities/admin_sessions')
var flat = require(enduro.enduro_path + '/libs/flat_db/flat')

// routed call
api_call.prototype.call = function (req, res, enduro_server) {

	// gets query parameters
	var sid = req.query.sid
	var globalizer_string = req.query.globalizer_string
	var page_path = req.query.page_path

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
			}, enduro.cms_data)

			if (!output && page_path) {
				return flat.load(page_path)
					.then((page_context) => {
						output = globalizer_string.split('.').reduce((prev, next) => {
							parent = prev
							return prev[next]
						}, page_context)

						res.send(output)
					})
			} else {
				res.send(output)
			}
		})
}

module.exports = new api_call()
