// * ———————————————————————————————————————————————————————— * //
// * 	enduro's production server
// *
// *	runs production server with password protection and
// *	admin ui and better routing
// *
// *	uses express mvc
// * ———————————————————————————————————————————————————————— * //
const enduro_server = function () {}

// * vendor dependencies
const express = require('express')
const app = express()
const session = require('express-session')
const cors = require('cors')
const multiparty_middleware = require('connect-multiparty')()
const cookieParser = require('cookie-parser')

// * enduro dependencies
const admin_api = require(enduro.enduro_path + '/libs/admin_api')
const website_app = require(enduro.enduro_path + '/libs/website_app')
const trollhunter = require(enduro.enduro_path + '/libs/trollhunter')
const logger = require(enduro.enduro_path + '/libs/logger')
const ab_tester = require(enduro.enduro_path + '/libs/ab_testing/ab_tester')
const brick_handler = require(enduro.enduro_path + '/libs/bricks/brick_handler')

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
	const self = this

	server_setup = server_setup || {}

	return new Promise(function (resolve, reject) {

		// overrides the port by system environment variable
		enduro.config.port = process.env.PORT || enduro.flags.port || enduro.config.port || 5000

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

		// robots.txt
		app.get('/robots.txt', function (req, res) {
			res.type('text/plain')
			res.send("User-agent: *\nAllow: /")
		})

		// serve bricks' static assets
		brick_handler.serve_brick_static_assets(app, express)

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

						let requested_url = req.url

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
						res.sendFile(enduro.config.admin_folder + '/enduro_login/index.html')
					})
			}
		})

		// init socket and store everybody in global enduro.sockets
		const io = require('socket.io')(enduro.server)
		enduro.sockets = io.sockets
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
