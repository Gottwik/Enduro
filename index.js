// * ———————————————————————————————————————————————————————— * //
// *
// *    ___  ____  ____/ /_  ___________
// *   / _ \/ __ \/ __  / / / / ___/ __ \
// *  /  __/ / / / /_/ / /_/ / /  / /_/ /
// *  \___/_/ /_/\__,_/\__,_/_/   \____/
// *
// * ———————————————————————————————————————————————————————— * //

// stores templating engine for possible future replacement
global.__templating_engine = require('handlebars')

// vendor dependencies
var path = require('path')

// global variables
global.__data = {}
global.__data.global = {}
global.config = {}
global.config.secret = {}
global.CMD_FOLDER = process.cwd()
global.ENDURO_FOLDER = __dirname
global.ADMIN_FOLDER = path.join(CMD_FOLDER, 'node_modules', 'enduro_admin', '_src') // this is production setting
global.BABEL_FILE = 'config/babel'
global.START_PATH = ''
global.flags = {}
global.abstractors = {}
global.markdownifier = require(ENDURO_FOLDER + '/libs/markdown/markdownifier')

// local dependencies
var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')
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
var flag_handler = require(ENDURO_FOLDER + '/libs/cli_tools/flag_handler')
var juicebox = require(ENDURO_FOLDER + '/libs/juicebox/juicebox')
var enduro_server = require(ENDURO_FOLDER + '/server')
var log_clusters = require(ENDURO_FOLDER + '/libs/log_clusters/log_clusters')
var pregenerator = require(ENDURO_FOLDER + '/libs/pregenerator/pregenerator')
var abstractor = require(ENDURO_FOLDER + '/libs/abstractor/abstractor')

// sets different admin if enduro is being used globally
if(!enduro_helpers.dirExists(ADMIN_FOLDER)) {
	global.ADMIN_FOLDER = path.join(ENDURO_FOLDER, 'node_modules', 'enduro_admin', '_src') // this is production setting
}

// gets gulp tasks and extend it with refresh function which will render enduro
gulp.set_refresh(function(callback){
	kiska_logger.log('Refresh', true, 'enduro_render_events')
	render(function(){
		callback()
	}, true)
})

// stores enduro_server and extends it with render

enduro_server.set_init(function(cb){
	var first_production_render = true
	var first_production = true

	kiska_logger.log('initializing production server', true, 'enduro_render_events')
	gulp.start('preproduction', () => {
		if(first_production_render) {
			render(function(){
				if(first_production) {
					gulp.start('production', () => {
						cb()
					})
					first_production = false
				}
			})
			first_production_render = false
		}
	})
})

enduro_server.set_refresh(function(cb){
	kiska_logger.log('refreshing production server', true, 'enduro_render_events')
	render(function(){
		cb()
	})
})


// * ———————————————————————————————————————————————————————— * //
// * 	run
// *	entry point from the cli
// *	returns boolean based on if the arguments were recognized
// * ———————————————————————————————————————————————————————— * //
function run(args, flags){
	global.flags = flag_handler.get_flag_object(flags)
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


				} else if(arg == 'juice'){
					arg = args.shift()
					if(arg == 'pack') {
						if(global.flags.force) {
							return juicebox.force_pack()
						} else {
							return juicebox.pack()
						}
					} else if(arg == 'pull') {
						return juicebox.pull()
					} else if(arg == 'diff') {
						return juicebox.diff()
					}

				} else if(arg == 'test'){
					var pagelist_generator = require(ENDURO_FOLDER + '/libs/build_tools/pagelist_generator')

					return pagelist_generator.get_cms_list()
						.then((pagelist) => {
							//console.log(pagelist)
						})
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
function render(callback, nojuice){
	kiska_logger.init('Enduro', 'enduro_render_events')
	juicebox.pull(nojuice, juicebox.no_juice_yet())
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
			return markdownifier.init()
		})
		.then(() => {
			return pregenerator.pregenerate()
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
var first = true
var firstrender = true
var firstserverstart = true
function developer_start() {
	return new Promise(function(resolve, reject){
		// clears the global data
		global_data.clear()

		log_clusters.log('developer_start')

		kiska_logger.timestamp('developer start', 'enduro_events')
		// Does the refresh procedure
		gulp.start('preproduction', () => {
			if(first){
				render(() => {
					kiska_logger.timestamp('Render finished', 'enduro_events')
					if(firstrender){
						gulp.start(flags.norefresh ? 'default_norefresh' : 'default', () => {
							if(firstserverstart && !flags.noadmin){
								kiska_logger.timestamp('production server starting', 'enduro_events')
								resolve()
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
	})
}

function server_stop(cb) {
	gulp.start('browser_sync_stop')
	enduro_server.stop(cb)
}

// Removes all logging
function silent(){
	kiska_logger.silent()
}

exports.run = run
exports.server_stop = server_stop
exports.silent = silent