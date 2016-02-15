var fs = require('fs')
var glob = require("glob")
var Promise = require('bluebird')
var flatFileHandler = require('../flat_utilities/flat_file_handler');

var api_call = function () {}

api_call.prototype.call = function(req, res, query){

	flatFileHandler.saveFlatRaw(query.cms_name, query.contents)
		.then(() => {
			res.send({success: true})
		}, (e) => {
			res.send({success: false, message: e})
		})

}

module.exports = new api_call()