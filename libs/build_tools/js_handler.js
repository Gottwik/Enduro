// vendor dependencies
var babel = require('gulp-babel')
var sourcemaps = require('gulp-sourcemaps')

// local dependencies
var logger = require(enduro.enduro_path + '/libs/logger')
// * ———————————————————————————————————————————————————————— * //
// * 	JS Task
// *	Transpile ES6 to JS
// * ———————————————————————————————————————————————————————— * //
var js_handler = function () {}

js_handler.prototype.init = function (gulp, browser_sync) {

	// stores task name
	var js_handler_task_name = 'js';
	gulp.task(js_handler_task_name, function() {
		if (enduro.config.babel) {
			logger.timestamp('JS compiling started', 'enduro_events')
			var babelConfig = enduro.config.babel || {
				presets: ['es2015']
			};
			return gulp.src([enduro.project_path + '/assets/js/*.js',
							'!' + enduro.project_path + '/assets/js/*.min.js',
							'!' + enduro.project_path + '/assets/js/handlebars.js'])
				.pipe(sourcemaps.init())
				.pipe(babel(babelConfig))
				.on('error', function (err) {
					logger.err_blockStart('JS error')
					logger.err(err.message)
					logger.err_blockEnd()
					this.emit('end')
				})
				.pipe(sourcemaps.write())
				.pipe(gulp.dest(enduro.project_path + '/' + enduro.config.build_folder + '/assets/js'))
				.pipe(browser_sync.stream())
				.on('end', () => {
					logger.timestamp('JS compiling finished', 'enduro_events')
				})
		} else {
			logger.timestamp('js compiling not enabled, add babel options to enduro.json to enable')
		}
	})

	return js_handler_task_name;
}

module.exports = new js_handler()
