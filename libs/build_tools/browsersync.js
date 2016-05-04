// * ———————————————————————————————————————————————————————— * //
// * 	Browsersync
// *	starts a webserver to serve the website
// * ———————————————————————————————————————————————————————— * //

var browsersync = function () {};

var watch = require('gulp-watch')
var browserSync = require('browser-sync').create()

// Creates all subdirectories neccessary to create the file in filepath
browsersync.prototype.init = function(gulp) {
	gulp.task('browsersync', function() {

		browserSync.init({
			server: {
				baseDir: CMD_FOLDER + '/_src',
				middleware: function(req, res, next) {
					// server admin/index file on /admin url
					if(req.url == '/admin/'){ req.url = '/admin/index.html' }
					// serve files without html
					else if(!(req.url.indexOf('.')+1) && req.url.length > 3){
						req.url += '.html'
					}
					return next()
				},
			},
			ui: false,
			logLevel: 'silent',
			notify: false,
			logPrefix: 'Enduro',
			startPath: START_PATH
		});

		watch([ CMD_FOLDER + '/assets/css/**/*', CMD_FOLDER + '/assets/fonticons/*', '!' + CMD_FOLDER + '/assets/css/sprites/*'],
					() => { gulp.start('scss-lint', 'sass') })										// Watch for scss
		watch([CMD_FOLDER + '/assets/js/**/*'], () => { gulp.start('js') })							// Watch for js
		watch([CMD_FOLDER + '/assets/img/**/*'], () => { gulp.start('img') })						// Watch for images
		watch([CMD_FOLDER + '/assets/vendor/**/*'], () => { gulp.start('vendor') })					// Watch for vendor files
		watch([CMD_FOLDER + '/assets/fonts/**/*'], () => { gulp.start('fonts') })					// Watch for fonts
		watch([CMD_FOLDER + '/assets/hbs_helpers/**/*'], () => { gulp.start('hbs_helpers') })		// Watch for local handlebars helpers
		watch([CMD_FOLDER + '/assets/spriteicons/*.png'], () => { gulp.start('sass') })				// Watch for png icons
		watch([CMD_FOLDER + '/assets/fonticons/*.svg'], () => {
			gulp.start('iconfont')
			gulp.enduroRefresh(() => {})
		})			// Watch for font icon
		watch([CMD_FOLDER + '/_src/**/*.html'], () => { browserSync.reload() })						// Watch for html files
		watch([CMD_FOLDER + '/components/**/*.hbs'], () => { gulp.start('hbs_templates') })			// Watch for hbs templates

		// Watch for enduro changes
		watch([CMD_FOLDER + '/pages/**/*.hbs', CMD_FOLDER + '/components/**/*.hbs', CMD_FOLDER + '/cms/**/*.js'], function() {
			gulp.enduroRefresh(() => {})
		})
	});

	return 'browsersync'
}

module.exports = new browsersync()