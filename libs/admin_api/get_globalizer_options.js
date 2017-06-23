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

// routed call
api_call.prototype.call = function (req, res, enduro_server) {

	// gets query parameters
	var sid = req.query.sid
	var globalizer_string = req.query.globalizer_string

	// checks if all required parameters had been received
	if (!sid || !globalizer_string) {
		res.send({ success: false })
		return
	}

	admin_sessions.get_user_by_session(sid)
		.then((user) => {

			// will store the specified object
			var parent

			// goes through globalizer string splitted by .
			globalizer_string
				.substring(2)
				.split('.')
				.reduce((prev, next) => {
					parent = prev
					return prev[next]
				}, enduro.cms_data)

			globalizer_options = Object.keys(parent).map((option) => {
				// we just remove last key and add the different options
				return globalizer_string.split('.').slice(0, -1).join('.') + '.' + option
			})

			res.send(globalizer_options)
		})
}

module.exports = new api_call()
