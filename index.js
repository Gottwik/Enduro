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

global.__data = {}
global.__data.global = {}
global.config = {}
global.CMD_FOLDER = process.cwd()
global.ENDURO_FOLDER = __dirname
global.ADMIN_FOLDER = __dirname + '/admin'
global.BABEL_FILE = CMD_FOLDER + '/cms/config/babel.js'
global.START_PATH = ''


var enduro_configurator = require(ENDURO_FOLDER + '/libs/enduro_configurator')
var scaffolder = require(ENDURO_FOLDER + '/libs/scaffolder')
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')
var global_data = require(ENDURO_FOLDER + '/libs/global_data')
var helper_handler = require(ENDURO_FOLDER + '/libs/helper_handler')
var components_handler = require(ENDURO_FOLDER + '/libs/components_handler')
var enduro_render = require(ENDURO_FOLDER + '/libs/enduro_render')
var kiska_guard = require(ENDURO_FOLDER + '/libs/kiska_guard')
var js_build = require(ENDURO_FOLDER + '/libs/build_utils/js_build')

// Gets gulp tasks and extend it with refresh function which will render enduro
var gulp = require('./gulpfile')
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

	enduro_configurator.read_config()
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
					js_build.build_js(args.shift())
				} else if(arg == 'testgulp'){
					caught = true
					gulp.start('prettyfier')
				}
			}

			// Some weird arguments
			if(!caught){
				kiska_logger.log('Arguments not recognized')
				return false
			}
			return true;
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
	kiska_logger.init()

	global_data.getGlobalData()
		.then(() => {
			return components_handler.readComponents()
		})
		.then(() => {
			return helper_handler.readHelpers()
		})
		.then(() => {
			return enduro_render.render()
		})
		.then(() => {
			kiska_logger.end()
			if(callback){
				callback()
			}
		})
}


// * ———————————————————————————————————————————————————————— * //
// * 	Developer Start
// *	Renders content and starts browsersync after that
// * ———————————————————————————————————————————————————————— * //
var first = true
var firstrender = true
function developer_start(){
	// clears the global data
	global_data.clear()

	// Does the refresh procedure
	gulp.start('preproduction', () => {
		if(first){
			render(() => {
				if(firstrender){
					gulp.start('default', () => {})
				}
				firstrender = false
			})
		}
		first = false
	})
}

// Removes logging
function silent(){
	kiska_logger.silent()
}

exports.run = run
exports.silent = silent