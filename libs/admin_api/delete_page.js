// * ———————————————————————————————————————————————————————— * //
// * 	delete page
// *
// * 	endpoint: /admin_api/delete_page
// *	deletes a page if it's possible to do so
// * ———————————————————————————————————————————————————————— * //
var api_call = function () {}

// vendor dependencies

// local dependencies
var admin_sessions = require(ENDURO_FOLDER + '/libs/admin_utilities/admin_sessions')
var page_adding_service = require(ENDURO_FOLDER + '/libs/admin_utilities/page_adding_service')
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')

// routed call
api_call.prototype.call = function (req, res, enduro_server) {

	// stores page name and generator name
	var pagename = req.query.pagename

	kiska_logger.timestamp('Trying to delete page' + pagename, 'page_manipulation')

	// checks if user is logged in
	admin_sessions.get_user_by_session(req.query.sid)
		.then((user) => {
			kiska_logger.timestamp(user + 'is trying to delete page ' + pagename, 'page_manipulation')
			return page_adding_service.delete_page(pagename)
		}, (user) => {
			kiska_logger.timestamp('deleting a page failed', 'page_manipulation')
			throw new Error('abort promise chain')
		})
		.then((pagelist) => {
			kiska_logger.timestamp('adding page successful', 'page_manipulation')
			res.send({success: true})
		}, () => {
			kiska_logger.timestamp('login failed', 'page_manipulation')
			res.send({success: false, message: 'session not valid'})
		})
}

module.exports = new api_call()
