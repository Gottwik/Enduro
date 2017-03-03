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
var flat = require(enduro.enduro_path + '/libs/flat_db/flat')
var admin_sessions = require(enduro.enduro_path + '/libs/admin_utilities/admin_sessions')
var format_service = require(enduro.enduro_path + '/libs/services/format_service')

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
			return flat.load(filename)
		}, () => {
			res.sendStatus(401)
			throw new Error('abort promise chain')
		})
		.then((data) => {

			var context = {}
			context.success = true
			context.page_name = data.$page_name || filename
			context.only_page_name = context.page_name.split('/').splice(-1)[0]

			// main data of the content file
			context.context = data

			// url where this page is served
			context.page_link = flat.url_from_filename(context.page_name)

			// associated page means that the page content file is directly linked with an existing url
			// this is used when deciding whether provide a link from admin to the page that is being edited
			context.has_page_associated = flat.has_page_associated(context.page_name)

			// name is capitalized and _ are replaced with whitespace
			context.pretty_name = format_service.prettify_string(context.only_page_name)

			// path to the content file provided in array
			context.path_list = context.page_name.split('/')

			// bool saying whether content file can be deleted
			context.deletable = flat.is_deletable(context.page_name)

			res.send(context)
		}, () => {})
}

module.exports = new api_call()
