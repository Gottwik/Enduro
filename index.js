
// Stores templating engine for possible future replacement
global.__templating_engine = require('handlebars')

global.__data = {}

var scaffolder = require('./libs/scaffolder')
var kiskaLogger = require('./libs/kiska_logger')
var globalData = require('./libs/global_data')
var helperHandler = require('./libs/helper_handler')
var componentsHandler = require('./libs/components_handler')
var enduroRender = require('./libs/enduro_render')

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
	
	// Production task includes enduro render
	gulp.start('production')
})


// * ———————————————————————————————————————————————————————— * //
// * 	Run
// *	Entry point from the cli
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
		} else if(arg == 'create' || arg == 'c'){
			caught = true
			scaffolder.scaffold(args)
		}
	}

	// Some weird arguments
	if(!caught){ console.log('Arguments not recognized', args) }
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
// * 	Start
// *	Renders content and starts browsersync after that
// * ———————————————————————————————————————————————————————— * //
function developer_start(){
	render(function(){
		gulp.start('default')
	})
}


exports.run = run