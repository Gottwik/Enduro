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
global.BABEL_FILE = CMD_FOLDER + '/cms/config/babel.js'
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

// Gets gulp tasks and extend it with refresh function which will render enduro
gulp.setRefresh(function(callback){
	render(function(){
		callback()
	})
})

// Stores enduroServer and extends it with render
var enduroServer = require('./server')
enduroServer.setRefresh(function(cb){
	gulp.start('preproduction', () => {
		render(function(){
			gulp.start('production', () => {
				cb()
			})
		})
	})
})


// * ———————————————————————————————————————————————————————— * //
// * 	Run
// *	Entry point from the cli
// *	Returns boolean based on if the arguments were recognized
// * ———————————————————————————————————————————————————————— * //
function run(args){

	return enduro_configurator.read_config()
		.then(() => {

			// No arguments at all - User ran $ enduro
			if(args.length == 0){
				return developer_start();
			}

			// Parse arguments
			var caught = false;
			while (arg = args.shift()) {
				if(arg == 'render' || arg == 'r'){
					caught = true
					return render()
				} else if(arg == 'start'){
					caught = true
					return enduroServer.run();
				} else if(arg == 'create'){
					caught = true
					return scaffolder.scaffold(args)
				} else if(arg == 'secure'){
					caught = true
					return kiska_guard.set_passphrase(args)
				} else if(arg == 'build'){
					caught = true
					return js_build.build_js(args.shift())
				} else if(arg == 'check'){
					caught = true
					return gulp.start('check')
				} else if(arg == 'addadmin'){
					caught = true
					return admin_security.add_admin(args.shift(), args.shift())
				}
			}

			// Some weird arguments
			if(!caught){
				kiska_logger.log('Arguments not recognized')
				return new Promise(function(resolve, reject){ reject('not recognized') })
			}

			return new Promise(function(resolve, reject){ resolve({}) })
	})
}


// * ———————————————————————————————————————————————————————— * //
// * 	Render
// *	- Reads configuration file
// *	- Loads global settings
// *	- Loads copomentns
// *	- Loads helpers
// *	- Renders files in ../pages
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
// 				enduroServer.run();
// 				// After everything is done
// 			})
// 		})
// 	})
// }
var first = true
var firstrender = true
var firstserverstart = true
function developer_start(){
	// clears the global data
	global_data.clear()

	kiska_logger.init('Enduro started', 'nice_dev_init')
	kiska_logger.log('Development server started at:', 'nice_dev_init')
	kiska_logger.tablog('localhost:3000', 'nice_dev_init')
	kiska_logger.log('Admin ui available at:', 'nice_dev_init')
	kiska_logger.tablog('localhost:5000/admin', false, 'nice_dev_init')
	kiska_logger.line('nice_dev_init');
	kiska_logger.log('Admin has no live-reload!', false, 'nice_dev_init')
	kiska_logger.end('nice_dev_init')

	kiska_logger.timestamp('developer start', 'enduro_events')
	// Does the refresh procedure
	gulp.start('preproduction', () => {
		if(first){
			render(() => {
				if(firstrender){
					gulp.start('default', () => {
						if(firstserverstart){
							kiska_logger.timestamp('production server starting', 'enduro_events')

							// start production server in development mode
							enduroServer.run(true);
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