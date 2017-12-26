// * ———————————————————————————————————————————————————————— * //
// * 	get outstanding changes
// *
// *	@return {response} - diff with most current local juicebox
// * ———————————————————————————————————————————————————————— * //
const api_call = function () {}

// * enduro dependencies
const juicebox = require(enduro.enduro_path + '/libs/juicebox/juicebox')
const admin_sessions = require(enduro.enduro_path + '/libs/admin_utilities/admin_sessions')

// routed call
api_call.prototype.call = function (req, res, enduro_server) {
	admin_sessions.get_user_by_session(req.query.sid)
		.then((user) => {
			if (!enduro.config.juicebox_enabled) {
				return {}
			}
			return juicebox.diff_current_to_latest_juicebox()
		}, () => {
			res.sendStatus(401)
			throw new Error('abort promise chain')
		})
		.then((diff) => {
			res.send(diff);
		}, () => {})
}

module.exports = new api_call()
