// * ———————————————————————————————————————————————————————— * //
// * 	get page list
// *
// * 	admin api endpoint admin_api/get_page_list
// *	@return {response} - success boolean and flattened page list in an array
// * ———————————————————————————————————————————————————————— * //
var api_call = function () {}

// local dependencies
var admin_sessions = require(enduro.enduro_path + '/libs/admin_utilities/admin_sessions')
var babel = require(enduro.enduro_path + '/libs/babel/babel')

// routed call
api_call.prototype.call = function (req, res, enduro_server) {

	admin_sessions.get_user_by_session(req.query.sid)
		.then((user) => {
			return babel.get_cultures()
		}, (user) => {
			res.sendStatus(401)
			throw new Error('abort promise chain')
		})
		.then((cultures) => {
			// returns the cultures without the last, empty culture
			if (cultures.length > 1) {
				cultures = cultures.slice(0, -1)
			}
			res.send({success: true, data: cultures})
		}, () => {})
}

module.exports = new api_call()
