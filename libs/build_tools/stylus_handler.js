// vendor dependencies
var stylus = require('gulp-stylus')
var sourcemaps = require('gulp-sourcemaps')
var autoprefixer = require('autoprefixer-stylus')

// local dependencies
var logger = require(enduro.enduro_path + '/libs/logger')

// * ———————————————————————————————————————————————————————— * //
// * 	Stylus Task
// *	Processes assets/css/main.styl file
// *	All other styl files need to be imported in main.styl to get compiled
// *	Add "stylus: true" to enduro.json
// * ———————————————————————————————————————————————————————— * //
var stylus_handler = function () {}

stylus_handler.prototype.init = function (gulp, browser_sync) {

	// stores task name
	var stylus_handler_task_name = 'stylus'

	// registeres task to provided gulp
	gulp.task(stylus_handler_task_name, function () {

		logger.timestamp('Stylus compiling started', 'enduro_events')

		return gulp.src(enduro.project_path + '/assets/css/*.styl')
			.pipe(sourcemaps.init())
			.pipe(stylus({
				use: [ autoprefixer('last 5 versions') ]
			}))
			.on('error', function (err) {
				logger.err_blockStart('Stylus error')
				logger.err(err.message)
				logger.err_blockEnd()
				this.emit('end')
			})
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(enduro.project_path + '/' + enduro.config.build_folder + '/assets/css'))
			.pipe(browser_sync.stream())
			.on('end', () => {
				logger.timestamp('Stylus compiling finished', 'enduro_events')
			})
	})

	return stylus_handler_task_name
}

module.exports = new stylus_handler()
