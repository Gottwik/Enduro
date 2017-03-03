// * ———————————————————————————————————————————————————————— * //
// * 	image upload endpoint
// *
// * 	simples version adds the
// *	@return {response} - success boolean
// * ———————————————————————————————————————————————————————— * //
var api_call = function () {}

// local dependencies
var file_uploader = require(enduro.enduro_path + '/libs/admin_utilities/file_uploader')
var admin_sessions = require(enduro.enduro_path + '/libs/admin_utilities/admin_sessions')
var logger = require(enduro.enduro_path + '/libs/logger')
var admin_rights = require(enduro.enduro_path + '/libs/admin_utilities/admin_rights')

// routed call
api_call.prototype.call = function (req, res, enduro_server) {
	logger.timestamp('Trying to upload a file', 'file_uploading')
	admin_sessions.get_user_by_session(req.body.sid)
		.then((user) => {

			if (!admin_rights.can_user_do_that(user, 'write')) {
				res.sendStatus(403)
				throw new Error()
			}

			logger.timestamp('uploading file: ' + req.files.file.name, 'file_uploading')
			return file_uploader.upload(req.files.file)
		}, (user) => {
			res.sendStatus(401)
			throw new Error(true)
		})
		.then((image_url) => {
			res.send({
				success: true,
				image_url: image_url
			})
		}, () => {
			if (!res.headersSent) {
				res.send({success: false})
			}
		})
}

module.exports = new api_call()
