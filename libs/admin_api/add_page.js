// * ———————————————————————————————————————————————————————— * //
// * 	add page
// * ———————————————————————————————————————————————————————— * //
var api_call = function () {}

// vendor dependencies

// local dependencies
var admin_sessions = require(ENDURO_FOLDER + '/libs/admin_utilities/admin_sessions')
var page_adding_service = require(ENDURO_FOLDER + '/libs/admin_utilities/page_adding_service')

// routed call
api_call.prototype.call = function(req, res, enduro_server){

	var new_pagename = req.query.new_pagename
	var generator = req.query.generator

	admin_sessions.get_user_by_session(req.query.sid)
		.then((user) => {
			return page_adding_service.new_generator_page(new_pagename, generator)
		}, (user) => {
			throw new Error('abort promise chain');
		})
		.then((pagelist) => {
			res.send({success: true})
		}, () => {
			res.send({success: false, message: 'session not valid'})
		})
}

module.exports = new api_call()