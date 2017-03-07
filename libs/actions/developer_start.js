// * ———————————————————————————————————————————————————————— * //
// * 	developer start
// * ———————————————————————————————————————————————————————— * //

var action = function () {}

var Promise = require('bluebird')
var extend = require('extend')
var nodemon = require('nodemon')

var global_data = require(enduro.enduro_path + '/libs/global_data')
var log_clusters = require(enduro.enduro_path + '/libs/log_clusters/log_clusters')
var enduro_server = require(enduro.enduro_path + '/server')
var gulp = require(enduro.enduro_path + '/gulpfile')
var logger = require(enduro.enduro_path + '/libs/logger')

action.prototype.action = function (config) {

	config = config || {}

	nodemon({
		ignore: ['/cms/*', '/_src/*'],
		script: enduro.project_path + '/app/app.js',
		ext: 'js'
	})

	nodemon.on('start', function () {
		console.log('App has started')
	}).on('quit', function () {
		console.log('App has quit')
	}).on('restart', function (files) {
		console.log('App restarted due to: ', files)
		enduro.website_app_init()
	})

	extend(true, enduro.flags, config)
	return new Promise(function (resolve, reject) {
		// clears the global data
		global_data.clear()

		log_clusters.log('developer_start')

		logger.timestamp('developer start', 'enduro_events')

		var prevent_double_callback = false

		enduro.actions.render()
			.then(() => {

				logger.timestamp('Render finished', 'enduro_events')

				gulp.start(enduro.flags.norefresh ? 'default_norefresh' : 'default', () => {
					if (!enduro.flags.noadmin && !prevent_double_callback) {
						prevent_double_callback = true
						logger.timestamp('production server starting', 'enduro_events')

						// start production server in development mode
						enduro_server.run({ development_mode: true })

						resolve()
					}
					// After everything is done
				})
			})
	})
}


module.exports = new action()