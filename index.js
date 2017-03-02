// * ———————————————————————————————————————————————————————— * //
// *
// *    ___  ____  ____/ /_  ___________
// *   / _ \/ __ \/ __  / / / / ___/ __ \
// *  /  __/ / / / /_/ / /_/ / /  / /_/ /
// *  \___/_/ /_/\__,_/\__,_/_/   \____/
// *
// * ———————————————————————————————————————————————————————— * //

// vendor dependencies
var path = require('path')
var Promise = require('bluebird')

// global variables
global._ = require('lodash')
global.__data = {}
global.__data.global = {}
global.config = {}
global.config.secret = {}
global.CMD_FOLDER = process.cwd()
global.ENDURO_FOLDER = __dirname
global.ADMIN_FOLDER = path.join(CMD_FOLDER, 'node_modules', 'enduro_admin', '_src') // this is production setting
global.BABEL_FILE = 'config/babel'
global.ADMIN_SECURE_FILE = '.users'
global.START_PATH = ''
global.flags = {}
global.abstractors = {}

global.markdownifier = require('promised-handlebars')(require('handlebars'), { Promise: Promise })

// stores global variables under enduro object to cut down on complexity
global.enduro = require(ENDURO_FOLDER + '/libs/linker/linker') // exposes enduro's libraries for app development

// local dependencies
var flat_helpers = require(ENDURO_FOLDER + '/libs/flat_db/flat_helpers')
var enduro_configurator = require(ENDURO_FOLDER + '/libs/enduro_configurator')
var scaffolder = require(ENDURO_FOLDER + '/libs/scaffolder')
var logger = require(ENDURO_FOLDER + '/libs/logger')
var global_data = require(ENDURO_FOLDER + '/libs/global_data')
var helper_handler = require(ENDURO_FOLDER + '/libs/helper_handler')
var components_handler = require(ENDURO_FOLDER + '/libs/components_handler')
var enduro_render = require(ENDURO_FOLDER + '/libs/enduro_render')
var trollhunter = require(ENDURO_FOLDER + '/libs/trollhunter')
var js_build = require(ENDURO_FOLDER + '/libs/build_utils/js_build')
var admin_security = require(ENDURO_FOLDER + '/libs/admin_utilities/admin_security')
var gulp = require(ENDURO_FOLDER + '/gulpfile')
var babel = require(ENDURO_FOLDER + '/libs/babel/babel')
var flag_handler = require(ENDURO_FOLDER + '/libs/cli_tools/flag_handler')
var juicebox = require(ENDURO_FOLDER + '/libs/juicebox/juicebox')
var enduro_server = require(ENDURO_FOLDER + '/server')
var log_clusters = require(ENDURO_FOLDER + '/libs/log_clusters/log_clusters')
var pregenerator = require(ENDURO_FOLDER + '/libs/pregenerator/pregenerator')
var abstractor = require(ENDURO_FOLDER + '/libs/abstractor/abstractor')
var ab_tester = require(ENDURO_FOLDER + '/libs/ab_testing/ab_tester')

// sets different admin if enduro is being used globally
if (!flat_helpers.dir_exists_sync(ADMIN_FOLDER)) {
	global.ADMIN_FOLDER = path.join(ENDURO_FOLDER, 'node_modules', 'enduro_admin', '_src') // this is production setting
}

// gets gulp tasks and extend it with refresh function which will render enduro
gulp.set_refresh(function (callback) {
	logger.log('Refresh', true, 'enduro_render_events')
	render(function () {
		callback()
	}, true)
})

enduro_server.set_init(function (cb) {
	logger.log('initializing production server', true, 'enduro_render_events')
	render(function () {
		cb()
	})
})

// will rerender everything without juice pull
enduro_server.set_refresh(function (cb) {
	logger.log('refreshing production server', true, 'enduro_render_events')
	render(function () {
		cb()
	}, true)
})

// * ———————————————————————————————————————————————————————— * //
// * 	run
// *	entry point from the cli
// *	returns boolean based on if the arguments were recognized
// * ———————————————————————————————————————————————————————— * //
function run (args, flags) {
	global.flags = flag_handler.get_flag_object(flags)
	return enduro_configurator.read_config()
		.then(() => {
			// * ———————————————————————————————————————————————————————— * //
			// * 	$ enduro
			// * ———————————————————————————————————————————————————————— * //
			if (args.length == 0) {
				return developer_start()
			}

			// parse arguments
			while (arg = args.shift()) {

				// * ———————————————————————————————————————————————————————— * //
				// * 	$ enduro render
				// * ———————————————————————————————————————————————————————— * //
				if (arg == 'render' || arg == 'r') {
					return render(() => {}, false)

				// * ———————————————————————————————————————————————————————— * //
				// * 	$ enduro start
				// * ———————————————————————————————————————————————————————— * //
				} else if (arg == 'start') {
					return enduro_server.run(args)

				// * ———————————————————————————————————————————————————————— * //
				// * 	$ enduro create projectname
				// * ———————————————————————————————————————————————————————— * //
				} else if (arg == 'create') {
					return scaffolder.scaffold(args)

				// * ———————————————————————————————————————————————————————— * //
				// * 	$ enduro secure passphrasehere
				// * ———————————————————————————————————————————————————————— * //
				} else if (arg == 'secure') {
					return trollhunter.set_passphrase(args)

				// * ———————————————————————————————————————————————————————— * //
				// * 	$ enduro build [dev]
				// * ———————————————————————————————————————————————————————— * //
				} else if (arg == 'build') {
					return js_build.build_js(args.shift())

				// * ———————————————————————————————————————————————————————— * //
				// * 	$ enduro addadmin (username) (password)
				// * ———————————————————————————————————————————————————————— * //
				} else if (arg == 'addadmin') {
					return admin_security.add_admin(args.shift(), args.shift(), args.shift())

				// * ———————————————————————————————————————————————————————— * //
				// * 	$ enduro addculture (culture1) [culture2] ...
				// * ———————————————————————————————————————————————————————— * //
				} else if (arg == 'addculture') {
					return babel.add_culture(args)

				// * ———————————————————————————————————————————————————————— * //
				// * 	$ enduro juice ...
				// * ———————————————————————————————————————————————————————— * //
				} else if (arg == 'juice') {
					arg = args.shift()

					// * ———————————————————————————————————————————————————————— * //
					// * 	$ enduro juice pack
					// * ———————————————————————————————————————————————————————— * //
					if (arg == 'pack') {
						if (global.flags.force) {
							return juicebox.force_pack()
						} else {
							return juicebox.pack()
						}

					// * ———————————————————————————————————————————————————————— * //
					// * 	$ enduro juice pull
					// * ———————————————————————————————————————————————————————— * //
					} else if (arg == 'pull') {
						return juicebox.pull()

					// * ———————————————————————————————————————————————————————— * //
					// * 	$ enduro juice diff
					// * ———————————————————————————————————————————————————————— * //
					} else if (arg == 'diff') {
						return juicebox.diff(args)

					// * ———————————————————————————————————————————————————————— * //
					// * 	$ enduro juice log
					// * ———————————————————————————————————————————————————————— * //
					} else if (arg == 'log') {
						return juicebox.log()
					}

				// * ———————————————————————————————————————————————————————— * //
				// * 	$ enduro flags
				// * ———————————————————————————————————————————————————————— * //
				} else if (arg == 'flags') {
					return flag_handler.list_flags()

				// * ———————————————————————————————————————————————————————— * //
				// * 	$ enduro offline
				// * ———————————————————————————————————————————————————————— * //
				} else if (arg == 'offline') {
					return require(ENDURO_FOLDER + '/libs/remote_tools/offline_handler').convert_all_to_offline()

				// * ———————————————————————————————————————————————————————— * //
				// * 	$ enduro upload
				// * ———————————————————————————————————————————————————————— * //
				} else if (arg == 'upload') {
					return require(ENDURO_FOLDER + '/libs/cli_tools/cli_upload').cli_upload(args.shift())

				// * ———————————————————————————————————————————————————————— * //
				// * 	$ enduro theme
				// * ———————————————————————————————————————————————————————— * //
				} else if (arg == 'theme') {
					return require(ENDURO_FOLDER + '/libs/theme_manager/theme_manager').create_from_theme(args.shift())

				// * ———————————————————————————————————————————————————————— * //
				// * 	$ enduro theme
				// * ———————————————————————————————————————————————————————— * //
				} else if (arg == 'test') {
					logger.loading('creating something')
					setTimeout(() => {
						logger.loaded('creating something')
					}, 3000)
				}
			}

			// some weird arguments
			logger.log('Arguments not recognized')
			return new Promise(function (resolve, reject) { reject('not recognized') })

		})
}

// * ———————————————————————————————————————————————————————— * //
// * 	render
// * ———————————————————————————————————————————————————————— * //
function render (callback, dont_do_juice_pull) {
	logger.init('Enduro', 'enduro_render_events')
	return Promise.resolve()
		.then(() => {
			if (!dont_do_juice_pull) {
				return juicebox.pull(juicebox.is_juicebox_enabled())
			} else {
				return new Promise.resolve()
			}
		})
		.then(() => {
			return global_data.get_global_data()
		})
		.then(() => {
			return components_handler.read_components()
		})
		.then(() => {
			return helper_handler.read_helpers()
		})
		.then(() => {
			return abstractor.init()
		})
		.then(() => {
			return enduro.markdownifier.init()
		})
		.then(() => {
			return ab_tester.generate_global_ab_list()
		})
		.then(() => {
			return pregenerator.pregenerate()
		})
		.then(() => {
			return new Promise(function (resolve, reject) {
				return gulp.start('preproduction', () => {
					resolve()
				})
			})
		})
		.then(() => {
			return enduro_render.render()
		})
		.then(() => {
			return new Promise(function (resolve, reject) {
				return gulp.start('production', () => {
					resolve()
				})
			})
		})
		.then(() => {
			logger.end('enduro_render_events')
			if (callback) {
				callback()
			}
		})
}

// * ———————————————————————————————————————————————————————— * //
// * 	Developer Start
// *	Renders content and starts browsersync after that
// * ———————————————————————————————————————————————————————— * //
var firstserverstart = true
function developer_start () {
	return new Promise(function (resolve, reject) {
		// clears the global data
		global_data.clear()

		log_clusters.log('developer_start')

		logger.timestamp('developer start', 'enduro_events')
		render(() => {
			logger.timestamp('Render finished', 'enduro_events')
			gulp.start(flags.norefresh ? 'default_norefresh' : 'default', () => {
				if (firstserverstart && !flags.noadmin) {
					logger.timestamp('production server starting', 'enduro_events')
					resolve()
					// start production server in development mode
					enduro_server.run({ development_mode: true })
				}
				firstserverstart = false
				// After everything is done
			})
		})
	})
}

function server_stop (cb) {
	gulp.start('browser_sync_stop')
	enduro_server.stop(cb)
}

// Removes all logging
function silent () {
	logger.silent()
}

exports.run = run
exports.server_stop = server_stop
exports.silent = silent
