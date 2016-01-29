global.__templating_engine = require('Handlebars')

var scaffolder = require('./libs/scaffolder')

var kiskaLogger = require('./libs/kiska_logger')
var globalData = require('./libs/global_data')
var helperHandler = require('./libs/helper_handler')
var componentsHandler = require('./libs/components_handler')
var sevenRender = require('./libs/seven_render')

var gulp = require('gulp')
var gulpfile = require('./gulpfile')


exports.run = run


// * ———————————————————————————————————————————————————————— * //
// * 	Run
// *	Entry point from cli anif
// * ———————————————————————————————————————————————————————— * //
function run(args){
	if(args.length == 0){
		return start();
	}

	var caught = false;

	while (arg = args.shift()) {
		if(arg == 'render' || arg == 'r'){
			caught = true
			return render()
		} else if(arg == 'create' || arg == 'c'){
			caught = true
			scaffolder.scaffold()
				.then(() => {
					return start()
				})
		}
	}

	if(!caught){
		console.log('Arguments not recognized', args)
	}
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
			return sevenRender.render()
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