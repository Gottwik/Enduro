// * ———————————————————————————————————————————————————————— * //
// * 	juice push
// *
// * 	endpoint: /admin_api/refresh
// *	pushes and re-renders project
// * ———————————————————————————————————————————————————————— * //
var api_call = function () {}

// local dependencies
var admin_sessions = require(enduro.enduro_path + '/libs/admin_utilities/admin_sessions')
var juicebox = require(enduro.enduro_path + '/libs/juicebox/juicebox')

// routed call
api_call.prototype.call = function (req, res, enduro_server) {

	var sid = req.query.sid

	enduro.flags.temporary_nostaticwatch = true
	admin_sessions.get_user_by_session(sid)
		.then((user) => {
			return juicebox.pack(user.username)
		}, () => {
			throw new Error()
		})
		.then(() => {
			return enduro.actions.render(true)
		}, () => {
			throw new Error()
		})
		.then(() => {
			return juicebox.diff()
		}, () => {
			throw new Error()
		})
		.then((diff_result) => {
			enduro.flags.temporary_nostaticwatch = false
			res.send({
				success: true,
				diff_result: diff_result
			})
		}, () => {
			enduro.flags.temporary_nostaticwatch = false
			res.sendStatus(403)
		})
}

module.exports = new api_call()
