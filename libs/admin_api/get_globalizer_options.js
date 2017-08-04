// * ———————————————————————————————————————————————————————— * //
// * 	get globalizer options
// *	will return siblings of object specified by globalizer path
// *	This is useful for the globalizer control, which is a select/dropdown and needs to know the siblings of current selection
// *
// * 	admin api endpoint admin_api/get_globalizer_options
// *	@param {string} sid - session id stored in cookie on client
// *	@param {string} globalizer_string - path to the global object
// *	@return {response} - success boolean and array with options
// *
// *	example:
// *		for this object
// *		{
// *			toys: {
// *				mindstorms: {
// *					website: 'http://www.lego.com/en-us/mindstorms'
// *				},
// *				duplo: {
// *					website: 'http://www.lego.com/en-us/duplo'
// *				}
// *			}
// *		}
// *		
// *		and for this globalizer string: '@@toys.mindstorms'
// *
// *		returns ['toys.mindstorms', 'toys.duplo']
// *
// * ———————————————————————————————————————————————————————— * //
var api_call = function () {}

// local dependencies
var admin_sessions = require(enduro.enduro_path + '/libs/admin_utilities/admin_sessions')
var flat = require(enduro.enduro_path + '/libs/flat_db/flat')

// routed call
api_call.prototype.call = function (req, res, enduro_server) {

	// gets query parameters
	const sid = req.query.sid
	const globalizer_string = req.query.globalizer_string
	const page_path = req.query.page_path

	// checks if all required parameters had been received
	if (!sid || !globalizer_string) {
		res.send({ success: false })
		return
	}

	// just globalizer string exploded into an array
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
			// will store the specified object
			// this is because we want to get the parent of the target specified by the globalizer string
			var parent

			// goes through globalizer string splitted by .
			globalizer_chain
				.reduce((prev, next) => {
					parent = prev
					return prev[next]
				}, context_to_search_against)

			globalizer_options = Object.keys(parent).map((option) => {
				// we just remove last key and add the different options
				return '@@' + globalizer_chain.slice(0, -1).join('.') + '.' + option
			})

			res.send(globalizer_options)
		})
}

module.exports = new api_call()
