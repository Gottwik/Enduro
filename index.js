global.__templating_engine = require('Handlebars')

var scaffolder = require('./libs/scaffolder')

var kiskaLogger = require('./libs/kiska_logger')
var globalData = require('./libs/global_data')
var helperHandler = require('./libs/helper_handler')
var componentsHandler = require('./libs/components_handler')
var enduroRender = require('./libs/enduro_render')

var gulp = require('gulp')
var gulpfile = require('./gulpfile')

var enduroServer = require('./server');
enduroServer.setRefresh(function(callback){
	render(function(){
		callback()
	})
})
exports.run = run


// * ———————————————————————————————————————————————————————— * //
// * 	Run

// *	Entry point from cli anif
// * ———————————————————————————————————————————————————————— * //
function run(args){

	// No arguments at all
	if(args.length == 0){
		return start();
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
			scaffolder.scaffold()
				.then(() => {
					return start()
				})
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
	console.log('rendering')
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
function start(){
	render(function(){
		gulp.start('default')
	})
}