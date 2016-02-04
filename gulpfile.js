var gulp = require('gulp')
var watch = require('gulp-watch')
var browserSync = require('browser-sync').create()
var sass = require('gulp-sass')
var url = require('url')
var fs = require('fs')
var bulkSass = require('gulp-sass-bulk-import')
var kiskaLogger = require('./libs/kiska_logger')

gulp.setRefresh = function (callback) {
	gulp.enduroRefresh = callback;
}

gulp.enduroRefresh = function () {
	console.log('refresh not defined')
}

// * ———————————————————————————————————————————————————————— * //
// * 	Enduro Task
// *	Watches for changes in pages, components or cms data and run enduro refresh
// * ———————————————————————————————————————————————————————— * //
gulp.task('enduro', function() {
	watch([process.cwd() + '/pages/**/*.hbs', process.cwd() + '/components/**/*.hbs', process.cwd() + '/cms/**/*.js'], function() {
		gulp.enduroRefresh(() => {})
	})
});


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
		logLevel: 'info',
		notify: false,
		logPrefix: 'Enduro'
	});

	gulp.watch(process.cwd() + '/assets/css/**/*', ['sass'])
	gulp.watch(process.cwd() + '/assets/js/**/*', ['js'])
	gulp.watch(process.cwd() + '/assets/img/**/*', ['img'])
	gulp.watch(process.cwd() + '/assets/vendor/**/*', ['vendor'])
	gulp.watch(process.cwd() + '/assets/fonts/**/*', ['fonts'])
	gulp.watch(process.cwd() + '/_src/**/*.html', browserSync.reload)
});


// * ———————————————————————————————————————————————————————— * //
// * 	Sass Task
// *	Processes assets/css/main.scss file
// *	All other scss files need to be imported in main.scss to get compiled
// *	Uses bulkSass for @import subfolder/* funcionality
// * ———————————————————————————————————————————————————————— * //
gulp.task('sass', function() {
	return gulp.src(process.cwd() + '/assets/css/main.scss')
		.pipe(bulkSass())
		.pipe(sass())
		.on('error', function(err){
			kiskaLogger.errBlockStart('Sass error')
			console.log(err.message)
			kiskaLogger.errBlockEnd()
			this.emit('end');
		})
		.pipe(gulp.dest(process.cwd() + '/_src/assets/css'))
		.pipe(browserSync.stream())
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
		.pipe(gulp.dest(process.cwd() + '/_src/assets/img'));
});


// * ———————————————————————————————————————————————————————— * //
// * 	vendor
// * ———————————————————————————————————————————————————————— * //
gulp.task('vendor', function() {
	return gulp.src(process.cwd() + '/assets/vendor/**/*')
		.pipe(gulp.dest(process.cwd() + '/_src/assets/vendor'))
});


// * ———————————————————————————————————————————————————————— * //
// * 	fonts
// * ———————————————————————————————————————————————————————— * //
gulp.task('fonts', function() {
	return gulp.src(process.cwd() + '/assets/fonts/**/*')
		.pipe(gulp.dest(process.cwd() + '/_src/assets/fonts'))
});


// * ———————————————————————————————————————————————————————— * //
// * 	Default Task
// * ———————————————————————————————————————————————————————— * //
gulp.task('default', ['enduro', 'sass', 'js', 'img', 'vendor', 'fonts', 'browserSync'])

// * ———————————————————————————————————————————————————————— * //
// * 	Production Task
// *	No browsersync, no watching for anything
// * ———————————————————————————————————————————————————————— * //
gulp.task('production', ['enduro', 'sass', 'js', 'img', 'vendor', 'fonts'])


// Export gulp to enable access for enduro
module.exports = gulp