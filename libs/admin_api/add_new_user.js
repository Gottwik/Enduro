var fs = require('fs')
var glob = require("glob")
var Promise = require('bluebird')

var api_call = function () {}

api_call.prototype.call = function(req, res, query){
	res.send(query)
}

module.exports = new api_call()