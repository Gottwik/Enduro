// * ———————————————————————————————————————————————————————— * //
// * 	Prettyfier
// *	Autoformats the resulting html code
// * ———————————————————————————————————————————————————————— * //

var prettyfier = function () {}

var prettify = require('gulp-prettify')

// Creates all subdirectories neccessary to create the file in filepath
prettyfier.prototype.init = function (gulp) {
	gulp.task('prettyfier', function () {
		return gulp.src('_src/**/*.html')
		.pipe(prettify({
			indent_with_tabs: true,
			'max_preserve_newlines': 0,
			'eol': '\n',
			'end_with_newline': true
		}))
		.pipe(gulp.dest('_src'))
	})

	return 'prettyfier'
}

module.exports = new prettyfier()
