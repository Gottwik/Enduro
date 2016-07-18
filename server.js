// * ———————————————————————————————————————————————————————— * //
// * 	enduro's production server
// *
// *	runs production server with password protection and
// *	admin ui and better routing
// *
// *	uses express mvc
// * ———————————————————————————————————————————————————————— * //
var enduro_server = function () {}

// vendor dependencies
var express = require('express')
var app = express()
var session = require('express-session')
var cors = require('cors')
var multiparty_middleware = require('connect-multiparty')()

// local dependencies
var admin_api = require(ENDURO_FOLDER + '/libs/admin_api')
var website_app = require(ENDURO_FOLDER + '/libs/website_app')
var kiska_guard = require(ENDURO_FOLDER + '/libs/kiska_guard')
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')

// constants
var PRODUCTION_SERVER_PORT = 5000

// initialization of the sessions
app.set('trust proxy', 1)
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}))

app.use(cors())

var server

// * ———————————————————————————————————————————————————————— * //
// * 	server run
// *
// * 	starts the production server
// *	@param {boolean} development_mode - if true, prevents enduro render on start to prevent double rendering
// *	@return {}
// * ———————————————————————————————————————————————————————— * //
enduro_server.prototype.run = function(development_mode) {
	// stores current enduro_server instance
	var self = this

	return new Promise(function(resolve, reject){

		// 5000 or server's port
		app.set('port', (process.env.PORT || PRODUCTION_SERVER_PORT))

		// forward the app to running enduro application
		website_app.forward(app)

		kiska_logger.timestamp('heroku-debug - admin folder: ' + ADMIN_FOLDER, 'heroku_debug')

		// serve static files from /_src folder
		app.use('/admin', express.static(ADMIN_FOLDER))
		app.use('/assets', express.static(CMD_FOLDER + '/_src/assets'))

		// handle for executing enduro refresh from client
		app.get('/admin_api_refresh', function (req, res) {
			self.enduro_refresh(function(){
				res.send({success: true, message: 'enduro refreshed successfully'})
			})
		})

		// handle for all admin api calls
		app.all('/admin_api/*', multiparty_middleware, function (req, res) {
			admin_api.call(req, res, self)
		})


		// handle for all website api calls
		// kinda works but needs to be properly done
		app.get('/*', function (req, res) {
			if(!/admin\/(.*)/.test(req.url) && !/assets\/(.*)/.test(req.url)) {
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
							if(req.url.length <= 1 && config.cultures[0].length > 0) {
								return res.redirect('/' + config.cultures[0])
							}
							if(req.url.length <= 1 || (req.url.split('/')[1] && config.cultures.indexOf(req.url.split('/')[1]) + 1 && req.url.split('/').length <= 2)) {
								res.sendFile(CMD_FOLDER + '/_src' + req.url + '/index.html')
							} else {
								res.sendFile(CMD_FOLDER + '/_src' + req.url + '.html')
							}

						}, () => {
							res.sendFile(ADMIN_FOLDER + '/enduro_login.html')
						})
				}
			}
		})

		server = app.listen(app.get('port'), function () {
			kiska_logger.timestamp('Production server started at port ' + PRODUCTION_SERVER_PORT, 'enduro_events')
			if(!development_mode) {
				self.enduro_init(() => {
					resolve()
				})
			}
			else {
				resolve()
			}
		})
	})
}

enduro_server.prototype.stop = function(cb) {
	server.close(cb)
}

// sets enduro_refresh function from parent
enduro_server.prototype.set_refresh = function (callback) {
	this.enduro_refresh = callback
}

// placehodler refresh function - this function is being replaced by parent
enduro_server.prototype.enduro_refresh = function () {
	console.log('refresh not defined')
}

// sets enduro_refresh function from parent
enduro_server.prototype.set_init = function (callback) {
	this.enduro_init = callback
}

// placehodler refresh function - this function is being replaced by parent
enduro_server.prototype.enduro_init = function () {
	console.log('refresh not defined')
}

module.exports = new enduro_server()