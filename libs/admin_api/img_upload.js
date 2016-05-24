// * ———————————————————————————————————————————————————————— * //
// * 	image upload endpoint
// *
// * 	simples version adds the
// *	@return {response} - success boolean
// * ———————————————————————————————————————————————————————— * //
var api_call = function () {}

// vendor dependencies
var Promise = require('bluebird')

// local dependencies
var file_uploader = require(ENDURO_FOLDER + '/libs/admin_utilities/file_uploader')
var admin_sessions = require(ENDURO_FOLDER + '/libs/admin_utilities/admin_sessions')
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')

// routed call
api_call.prototype.call = function(req, res, enduro_server){
	kiska_logger.timestamp('Trying to upload a file','file_uploading')
	admin_sessions.get_user_by_session(req.body.sid)
		.then((user) => {
			kiska_logger.timestamp('uploading file: ' + req.files.file.name ,'file_uploading')
			return file_uploader.upload(req.files.file)
		}, (user) => {
			throw new Error('abort promise chain');
		})
		.then((image_url) => {
			res.send({
				success: true,
				image_url: image_url
			})
		}, () => {
			res.send({success: false})
		})
}

module.exports = new api_call()