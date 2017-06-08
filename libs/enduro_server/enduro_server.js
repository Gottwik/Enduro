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
var cookieParser = require('cookie-parser')

// local dependencies
var admin_api = require(enduro.enduro_path + '/libs/admin_api')
var website_app = require(enduro.enduro_path + '/libs/website_app')
var trollhunter = require(enduro.enduro_path + '/libs/trollhunter')
var logger = require(enduro.enduro_path + '/libs/logger')
var ab_tester = require(enduro.enduro_path + '/libs/ab_testing/ab_tester')

// initialization of the sessions
app.set('trust proxy', 1)
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: {},
}))

app.use(cookieParser())

app.use(cors())

// add enduro.js header
app.use(function (req, res, next) {
	res.header('X-Powered-By', 'enduro.js')
	next()
})

// * ———————————————————————————————————————————————————————— * //
// * 	server run
// *
// * 	starts the production server
// *	@param {boolean} development_mode - if true, prevents enduro render on start to prevent double rendering
// *	@return {}
// * ———————————————————————————————————————————————————————— * //
enduro_server.prototype.run = function (server_setup) {
	// stores current enduro_server instance
	var self = this

	server_setup = server_setup || {}

	return new Promise(function (resolve, reject) {

		// overrides the port by system environment variable
		enduro.config.port = process.env.PORT || enduro.flags.port || enduro.config.port

		// starts listening to request on specified port
		enduro.server = app.listen(enduro.config.port, function () {
			logger.timestamp('Production server started at port ' + enduro.config.port, 'enduro_events')
			if (!server_setup.development_mode && !enduro.flags.nocompile) {
				enduro.actions.render()
					.then(() => {
						resolve()
					})
			} else {
				resolve()
			}
		})

		// forward the app and server to running enduro application
		website_app.forward(app, enduro.server)

		logger.timestamp('heroku-debug - admin folder: ' + enduro.config.admin_folder, 'heroku_debug')

		// serve static files from /_generated folder
		app.use('/admin', express.static(enduro.config.admin_folder))
		app.use('/assets', express.static(enduro.project_path + '/' + enduro.config.build_folder + '/assets'))
		app.use('/_prebuilt', express.static(enduro.project_path + '/' + enduro.config.build_folder + '/_prebuilt'))
		app.use('/remote', express.static(enduro.project_path + '/remote'))

		// handle for executing enduro refresh from client
		app.get('/admin_api_refresh', function (req, res) {
			enduro.actions.render()
				.then(() => {
					res.send({ success: true, message: 'enduro refreshed successfully' })
				})
		})

		// handle for all admin api calls
		app.all('/admin_api/*', multiparty_middleware, function (req, res) {
			admin_api.call(req, res, self)
		})

		// handle for all website api calls
		app.use(function (req, res, next) {
			logger.timestamp('requested: ' + req.url, 'server_usage')

			// exclude admin calls and access to static assets
			if (!/admin\/(.*)/.test(req.url) && !/assets\/(.*)/.test(req.url)) {

				trollhunter.login(req)
					.then(() => {

						var requested_url = req.url

						let a = requested_url.split('/').filter(x => x.length)
						// serves index.html when empty or culture-only url is provided
						if (requested_url.length <= 1 ||
							(requested_url.split('/')[1] && enduro.config.cultures.indexOf(requested_url.split('/')[1]) + 1 && requested_url.split('/').length <= 2) ||
							a[a.length - 1].indexOf('.') === -1
							) {
							requested_url += requested_url.slice(-1) === '/' ? 'index' : '/index'
						}

						// applies ab testing
						return ab_tester.get_ab_tested_filepath(requested_url, req, res)

					}, () => {
						throw new Error('user not logged in')
					})
					.then((requested_url) => {
						// serves the requested file
						res.sendFile(enduro.project_path + '/' + enduro.config.build_folder + requested_url + '.html')
					}, () => {
						res.sendFile(enduro.config.admin_folder + '/enduro_login.html')
					})
			}
		})
	})
}

enduro_server.prototype.stop = function () {
	return new Promise(function (resolve, reject) {
		enduro.server.close(() => {
			resolve()
		})
	})
}

module.exports = new enduro_server()
