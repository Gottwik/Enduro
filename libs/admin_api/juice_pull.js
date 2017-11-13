// * ———————————————————————————————————————————————————————— * //
// * 	juice_pull
// *
// * 	endpoint: /admin_api/juice_pull
// *	pulls and re-renders project
// * ———————————————————————————————————————————————————————— * //
const api_call = function () {}

// * enduro dependencies
const admin_sessions = require(enduro.enduro_path + '/libs/admin_utilities/admin_sessions')
const juicebox = require(enduro.enduro_path + '/libs/juicebox/juicebox')

// routed call
api_call.prototype.call = function (req, res, enduro_server) {

	const sid = req.query.sid

	admin_sessions.get_user_by_session(sid)
		.then((user) => {
			return juicebox.pull(false)
		}, () => {
			throw new Error()
		})
		.then(() => {
			return enduro.actions.render()
		}, () => {
			throw new Error()
		})
		.then(() => {
			return juicebox.diff()
		}, () => {
			throw new Error()
		})
		.then((diff_result) => {
			res.send({
				success: true,
				diff_result: diff_result
			})
		}, () => {
			res.sendStatus(403)
		})
}

module.exports = new api_call()
