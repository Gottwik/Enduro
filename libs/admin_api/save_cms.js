var fs = require('fs')
var glob = require("glob")
var Promise = require('bluebird')

var api_call = function () {}

api_call.prototype.call = function(req, res, query){
	var file = query.cms_name
	var contents = 'module.exports = ' + query.contents
	console.log(contents)
	fs.writeFile( process.cwd() + '/cms/' + file + '.js' , contents, function(err) {
		if (err) { return req.send(err) }
		res.send('success')
	})	
}

module.exports = new api_call()