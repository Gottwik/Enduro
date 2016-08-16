// * ———————————————————————————————————————————————————————— * //
// * 	check juicebox enabled
// * ———————————————————————————————————————————————————————— * //
var api_call = function () {}

// local dependencies
var admin_sessions = require(ENDURO_FOLDER + '/libs/admin_utilities/admin_sessions')
var juicebox = require(ENDURO_FOLDER + '/libs/juicebox/juicebox')

// routed call
api_call.prototype.call = function(req, res, enduro_server) {

	var sid = req.query.sid

	admin_sessions.get_user_by_session(sid)
		.then((user) => {
			return juicebox.pull(false, true)
		})
		.then(() => {
			enduro_server.enduro_refresh(() => {
				res.send({success: true})
			})
		})
}

module.exports = new api_call()