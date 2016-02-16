var gulp = require('gulp')
var watch = require('gulp-watch')
var browserSync = require('browser-sync').create()
var sass = require('gulp-sass')
var url = require('url')
var fs = require('fs')
var bulkSass = require('gulp-sass-bulk-import')
var kiskaLogger = require('./libs/kiska_logger')
var scsslint = require('gulp-scss-lint')
var spritesmith = require('gulp.spritesmith')
var sourcemaps = require('gulp-sourcemaps')
var checkGem = require('gulp-check-gems')

gulp.setRefresh = function (callback) {
	gulp.enduroRefresh = callback;
}

gulp.enduroRefresh = function () {
	console.log('refresh not defined')
}


// * ———————————————————————————————————————————————————————— * //
// * 	Browsersync Task
// * ———————————————————————————————————————————————————————— * //
gulp.task('browserSync', ['sass'], function() {

	browserSync.init({
		server: {
			baseDir: process.cwd() + '/_src',
			middleware: function(req, res, next) {
				if(req.url == '/admin/'){ req.url = '/admin/index.html' }
				else if(!(req.url.indexOf('.')+1) && req.url.length > 3){
					req.url += '.html'
				}
				return next()
			},
		},
		ui: false,
		logLevel: 'silent',
		notify: false,
		logPrefix: 'Enduro'
	});

	watch([process.cwd() + '/assets/css/**/*'], () => { gulp.start('scss-lint', 'sass') })		// Watch for scss
	watch([process.cwd() + '/assets/js/**/*'], () => { gulp.start('js') })						// Watch for js
	watch([process.cwd() + '/assets/img/**/*'], () => { gulp.start('img') })					// Watch for images
	watch([process.cwd() + '/assets/vendor/**/*'], () => { gulp.start('vendor') })				// Watch for vendor files
	watch([process.cwd() + '/assets/fonts/**/*'], () => { gulp.start('fonts') })				// Watch for fonts
	watch([process.cwd() + '/assets/spriteicons/*.png'], () => { gulp.start('png_sprites') })	// Watch for png icons
	watch([process.cwd() + '/_src/**/*.html'], () => { browserSync.reload() })					// Watch for html files

	// Watch for enduro changes
	watch([process.cwd() + '/pages/**/*.hbs', process.cwd() + '/components/**/*.hbs', process.cwd() + '/cms/**/*.js'], function() {
		gulp.enduroRefresh(() => {})
	})
});


// * ———————————————————————————————————————————————————————— * //
// * 	Sass Task
// *	Processes assets/css/main.scss file
// *	All other scss files need to be imported in main.scss to get compiled
// *	Uses bulkSass for @import subfolder/* funcionality
// * ———————————————————————————————————————————————————————— * //
gulp.task('sass', function() {
	kiskaLogger.log('Processed sass')
	return gulp.src(process.cwd() + '/assets/css/main.scss')
		.pipe(bulkSass())
		.pipe(sourcemaps.init())
		.pipe(sass())
		.on('error', function(err){
			kiskaLogger.errBlockStart('Sass error')
			console.log(err.message)
			kiskaLogger.errBlockEnd()
			this.emit('end');
		})
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(process.cwd() + '/_src/assets/css'))
		.pipe(browserSync.stream())
});


// * ———————————————————————————————————————————————————————— * //
// * 	Scss lint
// * ———————————————————————————————————————————————————————— * //
gulp.task('scss-lint', function() {
	try{
		return gulp.src(process.cwd() + '/assets/css/**/*')
			.pipe(checkGem({gemfile: 'scss-lint'}, scsslint(
				{
					'config': __dirname + '/support_files/scss-lint.yml'
				}
			)));
	}
	catch(err){
		return console.log('No liting. you need to install scss_lint');
	}
});


// * ———————————————————————————————————————————————————————— * //
// * 	js
// *	Todo: require js optimization should go here
// * ———————————————————————————————————————————————————————— * //
gulp.task('js', function() {
	return gulp.src(process.cwd() + '/assets/js/**/*.js')
		.pipe(gulp.dest(process.cwd() + '/_src/assets/js'))
});


// * ———————————————————————————————————————————————————————— * //
// * 	img
// * ———————————————————————————————————————————————————————— * //
gulp.task('img', function() {
	return gulp.src(process.cwd() + '/assets/img/**/*')
		.pipe(gulp.dest(process.cwd() + '/_src/assets/img'))
})


// * ———————————————————————————————————————————————————————— * //
// * 	vendor
// * ———————————————————————————————————————————————————————— * //
gulp.task('vendor', function() {
	return gulp.src(process.cwd() + '/assets/vendor/**/*')
		.pipe(gulp.dest(process.cwd() + '/_src/assets/vendor'))
})


// * ———————————————————————————————————————————————————————— * //
// * 	fonts
// * ———————————————————————————————————————————————————————— * //
gulp.task('fonts', function() {
	return gulp.src(process.cwd() + '/assets/fonts/**/*')
		.pipe(gulp.dest(process.cwd() + '/_src/assets/fonts'))
})


// * ———————————————————————————————————————————————————————— * //
// * 	spriteicons
// *	will get all pngs out of assets/spriteicons folder
// *	and generate spritesheet out of them
// * ———————————————————————————————————————————————————————— * //
gulp.task('png_sprites', function() {
	var spriteData = gulp.src(process.cwd() + '/assets/spriteicons/*.png')
		.pipe(spritesmith({
			imgName: '_src/assets/spriteicons/spritesheet.png',
			cssName: 'assets/css/sprites/sprites.scss',
			padding: 3,
			cssTemplate: __dirname + '/support_files/sprite_generator.handlebars'
		}));
	spriteData.pipe(gulp.dest(process.cwd()));
})


// * ———————————————————————————————————————————————————————— * //
// * 	Default Task
// * ———————————————————————————————————————————————————————— * //
gulp.task('default', ['png_sprites', 'scss-lint', 'sass', 'js', 'img', 'vendor', 'fonts', 'browserSync'])

// * ———————————————————————————————————————————————————————— * //
// * 	Production Task
// *	No browsersync, no watching for anything.
// * ———————————————————————————————————————————————————————— * //
gulp.task('production', ['png_sprites', 'sass', 'js', 'img', 'vendor', 'fonts'])


// Export gulp to enable access for enduro
module.exports = gulp