
// * ———————————————————————————————————————————————————————— * //
// * 	Server
// *	Runs production server with password protection and
// *	admin ui and better routing
// * ———————————————————————————————————————————————————————— * //

// Vendor dependencies
var express = require('express')
var app = express()
var session = require('express-session')
var cors = require('cors')

// Local dependencies
var admin_api = require(ENDURO_FOLDER + '/libs/admin_api')
var website_api = require(ENDURO_FOLDER + '/libs/website_api')
var kiska_guard = require(ENDURO_FOLDER + '/libs/kiska_guard')

// Initialization of the sessions
app.set('trust proxy', 1)
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}))

app.use(cors());

var enduro_server = function () {}

enduro_server.prototype.run = function () {

	// stores current enduro_server instance
	var self = this;

	// 5000 or server's port
	app.set('port', (process.env.PORT || 5000))

	// Serve static files from /_src folder
	app.use('/admin', express.static(ADMIN_FOLDER))
	app.use('/assets', express.static(CMD_FOLDER + '/_src/assets'))

	// Handle for executing enduro refresh from client
	app.get('/admin_api_refresh', function (req, res) {
		self.enduroRefresh(function(){
			res.send({success: true, message: 'enduro refreshed successfully'})
		})
	});

	// Handle for all admin api calls
	app.get('/admin_api/*', function (req, res) {
		admin_api.call(req, res, self);
	});

	// Handle for all website api calls
	app.get('/api/*', function (req, res) {
		website_api.call(req, res);
	});

	// Handle for all website api calls
	// kinda works but needs to be properly done
	app.get('/*', function (req, res) {
		if(!/admin\/(.*)/.test(req.url)) {
			if(req.query['pswrd']){
				kiska_guard.login(req)
					.then(() => {
						var htmlFile = req.url.length > 1 ? req.url.substring(0, req.url.indexOf('?')) : '/'
						res.redirect(htmlFile)
					}, () => {
						res.sendFile(ADMIN_FOLDER + '/enduro_login.html')
					})
			}
			else{
				kiska_guard.login(req)
					.then(() => {
						var htmlFile = req.url.length > 1 ? req.url : '/index'
						res.sendFile(CMD_FOLDER + '/_src' + htmlFile + '.html')
					}, () => {
						res.sendFile(ADMIN_FOLDER + '/enduro_login.html')
					})
			}
		} else {
			console.log('requested page', req.url)
		}
	});

	app.listen(app.get('port'), function () {
		self.enduroRefresh(() => {})
	});

}

// Sets enduroRefresh function from parent
enduro_server.prototype.setRefresh = function (callback) {
	this.enduroRefresh = callback;
}

// Placehodler refresh function - This function is being replaced by parent
enduro_server.prototype.enduroRefresh = function () {
	console.log('refresh not defined')
}

module.exports = new enduro_server()