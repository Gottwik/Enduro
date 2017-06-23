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
var globalizer_helpers = require(enduro.enduro_path + '/libs/globalizer/globalizer_helpers')

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

	const globalizer_chain = globalizer_string
		.substring(2)
		.split('.')

	admin_sessions.get_user_by_session(sid)
		.then((user) => {

			if (page_path && globalizer_chain[0] != 'global') {
				return flat.load(page_path)
			} else {
				return enduro.cms_data
			}
		})
		.then((context_to_search_against) => {
			res.send(globalizer_helpers.route_context(context_to_search_against, globalizer_string))
		})
}

module.exports = new api_call()
