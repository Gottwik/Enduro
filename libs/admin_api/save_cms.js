// * ———————————————————————————————————————————————————————— * //
// * 	save cms
// *
// * 	admin api endpoint admin_api/save_cms
// *	@param {string} sid - session id stored in cookie on client
// *	@param {string} filename - name of the cms file. relative to cms/
// *	@param {string} content - content of the cms updated file - will be converted to js object and formated upon save
// *	@return {response} - success boolean and saved cms' file content
// * ———————————————————————————————————————————————————————— * //
const api_call = function () {}

// * enduro dependencies
const flat = require(enduro.enduro_path + '/libs/flat_db/flat')
const admin_sessions = require(enduro.enduro_path + '/libs/admin_utilities/admin_sessions')
const juicebox = require(enduro.enduro_path + '/libs/juicebox/juicebox')
const logger = require(enduro.enduro_path + '/libs/logger')
const admin_rights = require(enduro.enduro_path + '/libs/admin_utilities/admin_rights')

// routed call
api_call.prototype.call = function (req, res, enduro_server) {

	let jsonString = ''
	req.on('data', function (data) {
		jsonString += data
	})

	req.on('end', function () {

		jsonString = JSON.parse(jsonString)

		// gets parameters from query
		const sid = jsonString.sid
		const filename = jsonString.filename
		const content = jsonString.content

		// makes sure all required query parameters were sent
		if (!sid || !filename || !content) {
			res.send({success: false, message: 'Parameters not provided'})
			return logger.err('parameters not provided')
		}

		admin_sessions.get_user_by_session(sid)
			.then((user) => {
				if (!admin_rights.can_user_do_that(user, 'write')) {
					res.sendStatus(403)
					throw new Error()
				}

				// requesting_user = user

				// disable watching for cms files to prevent double rendering
				enduro.flags.temporary_nocmswatch = true
				return flat.save(filename, content)
			}, () => {
				res.sendStatus(401)
				throw new Error()
			})
			// removed juicebox pack from saving cms
			// .then(() => {
			// 	return juicebox.pack(requesting_user.username)
			// }, () => { throw new Error() })
			.then(() => {

				// re-renders enduro - essential to publishing the change
				return enduro.actions.render(true)

			}, () => { throw new Error() })
			.then(() => {
				// send the response early to cut down on publish time
				res.send()
			}, () => {})
	})

}

module.exports = new api_call()
