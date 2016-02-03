var gulp = require('gulp')
var watch = require('gulp-watch')
var browserSync = require('browser-sync').create()
var sass = require('gulp-sass')
var url = require('url')
var fs = require('fs')
var bulkSass = require('gulp-sass-bulk-import')
var copy = require('gulp-copy')

gulp.setRefresh = function (callback) {
	gulp.enduroRefresh = callback;
}

gulp.enduroRefresh = function () {
	console.log('refresh not defined')
}

// * ———————————————————————————————————————————————————————— * //
// * 	Enduro Task
// * ———————————————————————————————————————————————————————— * //
gulp.task('enduro', function() {
	watch([process.cwd() + '/pages/**/*.hbs', process.cwd() + '/components/**/*.hbs', process.cwd() + '/cms/*.js'], function() {
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
		// ui: false,
		// logLevel: 'silent',
		notify: false,
		logPrefix: 'Enduro'
	});

	gulp.watch(process.cwd() + '/assets/css/main.scss', ['sass'])
	gulp.watch(process.cwd() + '/assets/js/**/*', ['js'])
	gulp.watch(process.cwd() + '/assets/img/**/*', ['img'])
	gulp.watch(process.cwd() + '/assets/vendor/**/*', ['vendor'])
	gulp.watch(process.cwd() + '/_src/**/*.html', browserSync.reload)
});


// * ———————————————————————————————————————————————————————— * //
// * 	Sass Task
// * ———————————————————————————————————————————————————————— * //
gulp.task('sass', function() {
	return gulp.src(process.cwd() + '/assets/css/main.scss')
		.pipe(bulkSass())
		.pipe(sass())
		.pipe(gulp.dest(process.cwd() + '/_src/assets/css'))
		.pipe(browserSync.stream())
});


// * ———————————————————————————————————————————————————————— * //
// * 	js
// *	Todo: require js optimization should go here
// * ———————————————————————————————————————————————————————— * //
gulp.task('js', function() {
	return gulp.src(process.cwd() + '/assets/js/**/*.js')
		.pipe(gulp.dest(process.cwd() + '/_src/assets/js'));
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
		.pipe(gulp.dest(process.cwd() + '/_src/assets/vendor'));
});


// * ———————————————————————————————————————————————————————— * //
// * 	Default Task
// * ———————————————————————————————————————————————————————— * //
gulp.task('default', ['enduro', 'sass', 'js', 'img', 'vendor', 'browserSync'])

module.exports = gulp