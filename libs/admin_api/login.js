var fs = require('fs')
var glob = require("glob")
var Promise = require('bluebird')
var flatFileHandler = require('../flat_utilities/flat_file_handler');

var api_call = function () {}

api_call.prototype.call = function(req, res, query){
	console.log('password', req.query)
	if(req.query.password == '123') {
		res.send({
			success: true,
			sid: '1234561'
		})
	} else {
		res.send({
			success: false,
		})
	}
}

module.exports = new api_call()