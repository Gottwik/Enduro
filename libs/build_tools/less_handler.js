// * vendor dependencies
const less = require('gulp-less')
const sourcemaps = require('gulp-sourcemaps')
const LessAutoPrefix = require('less-plugin-autoprefix')
const autoprefixer = new LessAutoPrefix({ browsers: [ 'last 5 versions' ] })

// * enduro dependencies
const logger = require(enduro.enduro_path + '/libs/logger')

// * ———————————————————————————————————————————————————————— * //
// * 	Less Task
// *	Processes assets/css/main.less file
// *	All other less files need to be imported in main.less to get compiled
// *	To add paths for @import to use, add in your enduro.json:
// *	less: { paths: [ '/paths/to/files' ] }
// * ———————————————————————————————————————————————————————— * //
const less_handler = function () {}

less_handler.prototype.init = function (gulp, browser_sync) {

	// stores task name
	const less_handler_task_name = 'less'

	// registeres task to provided gulp
	gulp.task(less_handler_task_name, function () {

		logger.timestamp('Less compiling started', 'enduro_events')

		return gulp.src(enduro.project_path + '/assets/css/*.less')
			.pipe(sourcemaps.init())
			.pipe(less({
				paths: enduro.config.less && enduro.config.less.paths || [],
				plugins: [ autoprefixer ]
			}))
			.on('error', function (err) {
				logger.err_blockStart('Less error')
				logger.err(err.message)
				logger.err_blockEnd()
				this.emit('end')
			})
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(enduro.project_path + '/' + enduro.config.build_folder + '/assets/css'))
			.pipe(browser_sync.stream())
			.on('end', () => {
				logger.timestamp('Less compiling finished', 'enduro_events')
			})
	})

	return less_handler_task_name
}

module.exports = new less_handler()
