
// Stores templating engine for possible future replacement
global.__templating_engine = require('handlebars')

global.__data = {}
global.cmd_folder = process.cwd()

var scaffolder = require('./libs/scaffolder')
var kiskaLogger = require('./libs/kiska_logger')
var globalData = require('./libs/global_data')
var helperHandler = require('./libs/helper_handler')
var componentsHandler = require('./libs/components_handler')
var enduroRender = require('./libs/enduro_render')
var kiska_guard = require('./libs/kiska_guard')

// Gets gulp tasks and extend it with refresh function which will render enduro
var gulp = require('./gulpfile')
gulp.setRefresh(function(callback){
	render(function(){
		callback()
	})
})

// Stores enduroServer and extends it with render
var enduroServer = require('./server');
enduroServer.setRefresh(function(callback){
	render(function(){
		gulp.start('production')
		callback()
	})
	// Production task includes enduro render
})


// * ———————————————————————————————————————————————————————— * //
// * 	Run
// *	Entry point from the cli
// *	Returns boolean based on if the arguments were recognized
// * ———————————————————————————————————————————————————————— * //
function run(args){
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
			scaffolder.scaffold(args)
		} else if(arg == 'secure'){
			caught = true
			kiska_guard.setPassword(args)
		} else if(arg == 'testgulp'){
			var fs = require('fs')
			fs.writeFile('test.txt', 'aaaa');
		} else if(arg == 'build'){
			caught = true
			gulp.start('buildjs')
		}
	}

	// Some weird arguments
	if(!caught){
		kiskaLogger.log('Arguments not recognized')
		return false
	}
	return true;
}


// * ———————————————————————————————————————————————————————— * //
// * 	Render
// *	- Loads global settings
// *	- Loads copomentns
// *	- Loads helpers
// *	- Renders files in ../pages
// * ———————————————————————————————————————————————————————— * //
function render(callback){
	kiskaLogger.init()
	globalData.getGlobalData()
		.then(() => {
			return componentsHandler.readComponents()
		})
		.then(() => {
			return helperHandler.readHelpers()
		})
		.then(() => {
			return enduroRender.render()
		})
		.then(() => {
			kiskaLogger.end()
			if(callback){
				callback()
			}
		})
}


// * ———————————————————————————————————————————————————————— * //
// * 	Developer Start
// *	Renders content and starts browsersync after that
// * ———————————————————————————————————————————————————————— * //
function developer_start(){
	render(function(){
		gulp.start('default')
	})
}

// Removes logging
function silent(){
	kiskaLogger.silent()
}


exports.run = run
exports.silent = silent