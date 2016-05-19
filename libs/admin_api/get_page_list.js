var Promise = require('bluebird')

var pagelist_generator = require(ENDURO_FOLDER + '/libs/build_tools/pagelist_generator')
var admin_sessions = require(ENDURO_FOLDER + '/libs/admin_utilities/admin_sessions')

var api_call = function () {}

api_call.prototype.call = function(req, res, enduro_server){
	admin_sessions.get_user_by_session(req.query.sid)
		.then((user) => {
			return pagelist_generator.get_flat_pagelist()
		}, (user) => {
			res.send({success: false, message: 'session not valid'})
		})
		.then((pagelist) => {
			res.send({success: true, data: pagelist})
		}, () => {console.log('now here')})
}

module.exports = new api_call()