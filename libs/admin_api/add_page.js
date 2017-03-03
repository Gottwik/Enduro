// * ———————————————————————————————————————————————————————— * //
// * 	add page
// *
// * 	endpoint: /admin_api/add_page
// *	adds new generator page
// * ———————————————————————————————————————————————————————— * //
var api_call = function () {}

// vendor dependencies

// local dependencies
var admin_sessions = require(enduro.enduro_path + '/libs/admin_utilities/admin_sessions')
var page_adding_service = require(enduro.enduro_path + '/libs/admin_utilities/page_adding_service')
var logger = require(enduro.enduro_path + '/libs/logger')

// routed call
api_call.prototype.call = function (req, res, enduro_server) {

	// stores page name and generator name
	var new_pagename = req.query.new_pagename
	var generator = req.query.generator

	logger.timestamp('Trying to create a new page', 'page_manipulation')

	// checks if user is logged in
	admin_sessions.get_user_by_session(req.query.sid)
		.then((user) => {
			logger.timestamp(user + 'is trying to create a new page', 'page_manipulation')
			return page_adding_service.new_generator_page(new_pagename, generator)
		}, (user) => {
			logger.timestamp('adding page failed', 'page_manipulation')
			throw new Error('abort promise chain')
		})
		.then((pagelist) => {
			logger.timestamp('adding page successful', 'page_manipulation')
			res.send({success: true})
		}, () => {
			logger.timestamp('login failed', 'page_manipulation')
			res.send({success: false, message: 'session not valid'})
		})
}

module.exports = new api_call()
