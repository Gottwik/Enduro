// * ———————————————————————————————————————————————————————— * //
// * 	enduro.actions.developer_start
// * ———————————————————————————————————————————————————————— * //

var action = function () {}

var Promise = require('bluebird')
var extend = require('extend')

var global_data = require(enduro.enduro_path + '/libs/global_data')
var log_clusters = require(enduro.enduro_path + '/libs/log_clusters/log_clusters')
var enduro_server = require(enduro.enduro_path + '/libs/enduro_server/enduro_server')
var gulp_tasks = require(enduro.enduro_path + '/libs/build_tools/gulp_tasks')
var logger = require(enduro.enduro_path + '/libs/logger')

action.prototype.action = function (config) {

	config = config || {}

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

				gulp_tasks.start(enduro.flags.norefresh ? 'default_norefresh' : 'default', () => {
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
