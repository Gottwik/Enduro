// * ———————————————————————————————————————————————————————— * //
// * 	get page list
// *
// * 	admin api endpoint admin_api/get_page_list
// *	@return {response} - success boolean and flattened page list in an array
// * ———————————————————————————————————————————————————————— * //
var api_call = function () {}

// local dependencies
var admin_sessions = require(enduro.enduro_path + '/libs/admin_utilities/admin_sessions')

// routed call
api_call.prototype.call = function (req, res, enduro_server) {

	admin_sessions.get_user_by_session(req.query.sid)
		.then((user) => {
			// returns the cultures without the last, empty culture
			if (enduro.config.cultures.length > 1) {
				res.send({ success: true, data: enduro.config.cultures.slice(0, -1) })
			} else {
				res.send({ success: true, data: enduro.config.cultures })
			}
		}, () => {})
}

module.exports = new api_call()
