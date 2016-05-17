var fs = require('fs')
var glob = require("glob")
var Promise = require('bluebird')

var flatFileHandler = require('../flat_utilities/flat_file_handler');

var api_call = function () {}

api_call.prototype.call = function(req, res, query){

	var username = req.query.username
	var password = req.query.password

	if(password == '123') {
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