var express = require('express')
var app = express()

var admin_api = require('./libs/admin_api')

var EnduroServer = function () {}

EnduroServer.prototype.run = function () {
	
	// stores current enduroServer instance
	var es = this;

	// 5000 or server's port
	app.set('port', (process.env.PORT || 5000))

	// Serve static files from /_src folder
	app.use(express.static(process.cwd()+'/_src'))

	// Handle for executing enduro refresh from client
	app.get('/admin_api_refresh', function (req, res) {
		es.enduroRefresh(function(){
			res.send({success: true, message: 'enduro refreshed successfully'})
		})
	});

	// Handle for all admin api calls
	app.get('/admin_api/*', function (req, res) {
		admin_api.call(req, res);
	});
	

	app.listen(app.get('port'), function () {
	  console.log('Enduro Started')
	});

}

// Sets enduroRefresh function from parent
EnduroServer.prototype.setRefresh = function (callback) {
	EnduroServer.prototype.enduroRefresh = callback;
}

// Placehodler refresh function - This function is being replaced by parent
EnduroServer.prototype.enduroRefresh = function () {
	console.log('refresh not defined')
}

module.exports = new EnduroServer()