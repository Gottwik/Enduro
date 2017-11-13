// * ———————————————————————————————————————————————————————— * //
// * 	JS Task
// *	Transpile ES6 to JS
// * ———————————————————————————————————————————————————————— * //
const js_handler = function () {}

// * vendor dependencies
const babel = require('gulp-babel')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const gulpif = require('gulp-if')
const sourcemaps = require('gulp-sourcemaps')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs-extra'))

// * enduro dependencies
const flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
const logger = require(enduro.enduro_path + '/libs/logger')

js_handler.prototype.init = function (gulp, browser_sync) {

	// stores task name
	const js_handler_task_name = 'js';
	gulp.task(js_handler_task_name, function() {
		if (enduro.config.babel || enduro.config.uglify) {
			logger.timestamp('JS compiling started', 'enduro_events')
			const babelConfig = enduro.config.babel || {
				presets: ['es2015']
			}
			return gulp.src([enduro.project_path + '/assets/js/*.js',
							'!' + enduro.project_path + '/assets/js/*.min.js',
							'!' + enduro.project_path + '/assets/js/handlebars.js'])
				.pipe(sourcemaps.init())
				.pipe(gulpif(enduro.config.babel, babel(babelConfig)))
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
				.pipe(gulpif(enduro.config.uglify, rename({ suffix: '.min' })))
				.pipe(gulpif(enduro.config.uglify, uglify()))
				.pipe(gulp.dest(enduro.project_path + '/' + enduro.config.build_folder + '/assets/js'))
		} else {
			logger.timestamp('js compiling not enabled, add babel options to enduro.json to enable')
			const copy_from = enduro.project_path + '/assets/js'
			const copy_to = enduro.project_path + '/' + enduro.config.build_folder + '/assets/js'
			return flat_helpers.dir_exists(copy_from)
				.then(() => {
					return fs.copyAsync(copy_from, copy_to, { overwrite: true })
				}, () => {})
		}
	})

	return js_handler_task_name;
}

module.exports = new js_handler()
