var express = require('express')
var spawn = require('child_process').spawn
var app = express()

var admin_api = require('./libs/admin_api')

var EnduroServer = function () {}

EnduroServer.prototype.run = function () {
	var es = this;
	app.use(express.static(process.cwd()+'/_src'))

	app.get('/admin_api_refresh', function (req, res) {
		es.enduroRefresh(function(){
			res.send({success: true, message: 'refreshed successfully'})
		})
	});

	app.get('/admin_api/*', function (req, res) {
		admin_api.call(req, res);
	});

	app.listen(3000, function () {
	  console.log('Enduro Started')
	});

}

EnduroServer.prototype.setRefresh = function (callback) {
	EnduroServer.prototype.enduroRefresh = callback;
}

EnduroServer.prototype.enduroRefresh = function () {
	console.log('refresh not defined')
}

module.exports = new EnduroServer()