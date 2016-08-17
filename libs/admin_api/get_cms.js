// * ———————————————————————————————————————————————————————— * //
// * 	get cms
// *
// * 	admin api endpoint admin_api/get_cms
// *	@param {string} sid - session id stored in cookie on client
// *	@param {string} filename - filename of the cms file
// *	@return {response} - success boolean and requested data file
// * ———————————————————————————————————————————————————————— * //
var api_call = function () {}

// local dependencies
var flat_file_handler = require(ENDURO_FOLDER + '/libs/flat_utilities/flat_file_handler')
var admin_sessions = require(ENDURO_FOLDER + '/libs/admin_utilities/admin_sessions')
var format_service = require(ENDURO_FOLDER + '/libs/services/format_service')

// routed call
api_call.prototype.call = function (req, res, enduro_server) {

	// gets query parameters
	var sid = req.query.sid
	var filename = req.query.filename

	// checks if all required parameters had been received
	if (!sid || !filename) {
		res.send({success: false})
		return
	}

	admin_sessions.get_user_by_session(sid)
		.then((user) => {
			return flat_file_handler.load(filename)
		}, () => {
			res.sendStatus(401)
			throw new Error('abort promise chain')
		})
		.then((data) => {

			var context = {}
			context.success = true
			context.page_name = data.$page_name || filename
			context.only_page_name = context.page_name.split('/').splice(-1)[0]
			context.context = data
			context.page_link = flat_file_handler.url_from_filename(context.page_name)
			context.no_page_associated = flat_file_handler.has_page_associated(context.page_name)
			context.pretty_name = format_service.prettify_string(context.only_page_name)
			context.path_list = context.page_name.split('/')

			res.send(context)
		}, () => {})
}

module.exports = new api_call()
