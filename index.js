// * ———————————————————————————————————————————————————————— * //
// *
// *    ___  ____  ____/ /_  ___________
// *   / _ \/ __ \/ __  / / / / ___/ __ \
// *  /  __/ / / / /_/ / /_/ / /  / /_/ /
// *  \___/_/ /_/\__,_/\__,_/_/   \____/
// *
// * ———————————————————————————————————————————————————————— * //

// Stores templating engine for possible future replacement
global.__templating_engine = require('handlebars')

// Global variables
global.__data = {}
global.__data.global = {}
global.config = {}
global.CMD_FOLDER = process.cwd()
global.ENDURO_FOLDER = __dirname
global.ADMIN_FOLDER = __dirname + '/admin'
global.BABEL_FILE = 'config/babel'
global.START_PATH = ''

// Local dependencies
var enduro_configurator = require(ENDURO_FOLDER + '/libs/enduro_configurator')
var scaffolder = require(ENDURO_FOLDER + '/libs/scaffolder')
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')
var global_data = require(ENDURO_FOLDER + '/libs/global_data')
var helper_handler = require(ENDURO_FOLDER + '/libs/helper_handler')
var components_handler = require(ENDURO_FOLDER + '/libs/components_handler')
var enduro_render = require(ENDURO_FOLDER + '/libs/enduro_render')
var kiska_guard = require(ENDURO_FOLDER + '/libs/kiska_guard')
var js_build = require(ENDURO_FOLDER + '/libs/build_utils/js_build')
var admin_security = require(ENDURO_FOLDER + '/libs/admin_utilities/admin_security')
var gulp = require(ENDURO_FOLDER + '/gulpfile')
var babel = require(ENDURO_FOLDER + '/libs/babel/babel')

// Gets gulp tasks and extend it with refresh function which will render enduro
gulp.set_refresh(function(callback){
	render(function(){
		callback()
	})
})

// Stores enduro_server and extends it with render
var enduro_server = require('./server')
enduro_server.set_refresh(function(cb){
	gulp.start('preproduction', () => {
		render(function(){
			gulp.start('production', () => {
				cb()
			})
		})
	})
})


// * ———————————————————————————————————————————————————————— * //
// * 	run
// *	entry point from the cli
// *	returns boolean based on if the arguments were recognized
// * ———————————————————————————————————————————————————————— * //
function run(args){

	return enduro_configurator.read_config()
		.then(() => {

			// * ———————————————————————————————————————————————————————— * //
			// * 	$ enduro
			// * ———————————————————————————————————————————————————————— * //
			if(args.length == 0){
				return developer_start()
			}

			// parse arguments
			while (arg = args.shift()) {
				// * ———————————————————————————————————————————————————————— * //
				// * 	$ enduro render
				// * ———————————————————————————————————————————————————————— * //
				if(arg == 'render' || arg == 'r'){
					return render()

				// * ———————————————————————————————————————————————————————— * //
				// * 	$ enduro nr
				// * ———————————————————————————————————————————————————————— * //
				} else if(arg == 'nr'){
					return developer_start(true)

				// * ———————————————————————————————————————————————————————— * //
				// * 	$ enduro start
				// * ———————————————————————————————————————————————————————— * //
				} else if(arg == 'start'){
					return enduro_server.run()

				// * ———————————————————————————————————————————————————————— * //
				// * 	$ enduro create projectname
				// * ———————————————————————————————————————————————————————— * //
				} else if(arg == 'create'){
					return scaffolder.scaffold(args)

				// * ———————————————————————————————————————————————————————— * //
				// * 	$ enduro secure passphrasehere
				// * ———————————————————————————————————————————————————————— * //
				} else if(arg == 'secure'){
					return kiska_guard.set_passphrase(args)

				// * ———————————————————————————————————————————————————————— * //
				// * 	$ enduro build [dev]
				// * ———————————————————————————————————————————————————————— * //
				} else if(arg == 'build'){
					return js_build.build_js(args.shift())

				// * ———————————————————————————————————————————————————————— * //
				// * 	$ enduro check
				// * ———————————————————————————————————————————————————————— * //
				} else if(arg == 'check'){
					return gulp.start('check')

				// * ———————————————————————————————————————————————————————— * //
				// * 	$ enduro addadmin (username) (password)
				// * ———————————————————————————————————————————————————————— * //
				} else if(arg == 'addadmin'){
					return admin_security.add_admin(args.shift(), args.shift())

				// * ———————————————————————————————————————————————————————— * //
				// * 	$ enduro addculture (culture1) [culture2] ...
				// * ———————————————————————————————————————————————————————— * //
				} else if(arg == 'addculture'){
					return babel.add_culture(args)
				}
			}

			// some weird arguments
			kiska_logger.log('Arguments not recognized')
			return new Promise(function(resolve, reject){ reject('not recognized') })

	})
}


// * ———————————————————————————————————————————————————————— * //
// * 	render
// *	- reads configuration file
// *	- loads global settings
// *	- loads copomentns
// *	- loads helpers
// *	- renders files in ../pages
// * ———————————————————————————————————————————————————————— * //
function render(callback){
	kiska_logger.init('Enduro', 'enduro_render_events')

	global_data.get_global_data()
		.then(() => {
			return components_handler.read_components()
		})
		.then(() => {
			return helper_handler.read_helpers()
		})
		.then(() => {
			return enduro_render.render()
		})
		.then(() => {
			kiska_logger.end('enduro_render_events')
			if(callback){
				callback()
			}
		})
}


// * ———————————————————————————————————————————————————————— * //
// * 	Developer Start
// *	Renders content and starts browsersync after that
// * ———————————————————————————————————————————————————————— * //
// function developer_start(){
// 	// clears the global data
// 	global_data.clear()

// 	// Does the refresh procedure
// 	gulp.start('preproduction', () => {
// 		render(() => {
// 			gulp.start('default', () => {
// 				enduro_server.run()
// 				// After everything is done
// 			})
// 		})
// 	})
// }
var first = true
var firstrender = true
var firstserverstart = true
function developer_start(norefresh){
	// clears the global data
	global_data.clear()

	kiska_logger.init('Enduro started', 'nice_dev_init')
	kiska_logger.log('Development server started at:', 'nice_dev_init')
	kiska_logger.tablog('localhost:3000', 'nice_dev_init')
	kiska_logger.log('Admin ui available at:', 'nice_dev_init')
	kiska_logger.tablog('localhost:5000/admin', false, 'nice_dev_init')
	kiska_logger.line('nice_dev_init')
	kiska_logger.log('Admin has no live-reload!', false, 'nice_dev_init')
	kiska_logger.end('nice_dev_init')

	kiska_logger.timestamp('developer start', 'enduro_events')
	// Does the refresh procedure
	gulp.start('preproduction', () => {
		if(first){
			render(() => {
				if(firstrender){
					gulp.start(norefresh ? 'default_norefresh' : 'default', () => {
						if(firstserverstart){
							kiska_logger.timestamp('production server starting', 'enduro_events')

							// start production server in development mode
							enduro_server.run(true)
						}
						firstserverstart = false
						// After everything is done
					})
				}
				firstrender = false
			})
		}
		first = false
	})
}

// Removes all logging
function silent(){
	kiska_logger.silent()
}

exports.run = run
exports.silent = silent