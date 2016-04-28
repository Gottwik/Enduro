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
var autoprefixer = require('gulp-autoprefixer')
var iconfont = require('gulp-iconfont')
var iconfontCss = require('gulp-iconfont-css')
var handlebars = require('gulp-handlebars')
var defineModule = require('gulp-define-module')
var flatten = require('gulp-flatten')
var prettify = require('gulp-prettify')
var concat = require('gulp-concat')
var filterBy = require('gulp-filter-by')
var wrap = require("gulp-wrap");

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


// * ———————————————————————————————————————————————————————— * //
// * 	Sass Task
// *	Processes assets/css/main.scss file
// *	All other scss files need to be imported in main.scss to get compiled
// *	Uses bulkSass for @import subfolder/* funcionality
// * ———————————————————————————————————————————————————————— * //
gulp.task('sass', ['png_sprites'], function() {
	return gulp.src(CMD_FOLDER + '/assets/css/main.scss')
		.pipe(bulkSass())
		.pipe(sourcemaps.init())
		.pipe(sass())
		.on('error', function(err){
			kiskaLogger.errBlockStart('Sass error')
			console.log(err.message)
			kiskaLogger.errBlockEnd()
			this.emit('end');
		})
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(CMD_FOLDER + '/_src/assets/css'))
		.pipe(browserSync.stream())
});


// * ———————————————————————————————————————————————————————— * //
// * 	Scss lint
// * ———————————————————————————————————————————————————————— * //
gulp.task('scss-lint', function() {
	try{
		return gulp.src(CMD_FOLDER + '/assets/css/**/*')
			.pipe(checkGem({gemfile: 'scss-lint'}, scsslint(
				{
					'config': __dirname + '/support_files/scss-lint.yml'
				}
			)));
	}
	catch(err){
		return console.log('No liting. you need to install scss_lint');
	}
})


// * ———————————————————————————————————————————————————————— * //
// * 	js
// *	Todo: require js optimization should go here
// * ———————————————————————————————————————————————————————— * //
gulp.task('js', function() {

	return gulp.src(CMD_FOLDER + '/assets/js/**/*')
		.pipe(gulp.dest(CMD_FOLDER + '/_src/assets/js'))

})


// * ———————————————————————————————————————————————————————— * //
// * 	img
// * ———————————————————————————————————————————————————————— * //
gulp.task('img', function() {
	return gulp.src(CMD_FOLDER + '/assets/img/**/*')
		.pipe(gulp.dest(CMD_FOLDER + '/_src/assets/img'))
})


// * ———————————————————————————————————————————————————————— * //
// * 	vendor
// * ———————————————————————————————————————————————————————— * //
gulp.task('vendor', function() {
	return gulp.src(CMD_FOLDER + '/assets/vendor/**/*')
		.pipe(gulp.dest(CMD_FOLDER + '/_src/assets/vendor'))
})


// * ———————————————————————————————————————————————————————— * //
// * 	fonts
// * ———————————————————————————————————————————————————————— * //
gulp.task('fonts', function() {
	return gulp.src(CMD_FOLDER + '/assets/fonts/**/*')
		.pipe(gulp.dest(CMD_FOLDER + '/_src/assets/fonts'))
})


// * ———————————————————————————————————————————————————————— * //
// * 	spriteicons
// *	will get all pngs out of assets/spriteicons folder
// *	and generate spritesheet out of them
// * ———————————————————————————————————————————————————————— * //
gulp.task('png_sprites', function() {
	return gulp.src(CMD_FOLDER + '/assets/spriteicons/*.png')
		.pipe(spritesmith({
			imgName: '_src/assets/spriteicons/spritesheet.png',
			cssName: '_src/_prebuilt/sprites.scss',
			padding: 3,
			cssTemplate: __dirname + '/support_files/sprite_generator.handlebars',
			retinaSrcFilter: [CMD_FOLDER + '/assets/spriteicons/*@2x.png'],
			retinaImgName: '_src/assets/spriteicons/spritesheet@2x.png',
		}))
		.pipe(gulp.dest(CMD_FOLDER));
})


// * ———————————————————————————————————————————————————————— * //
// * 	iconfont
// * ———————————————————————————————————————————————————————— * //
gulp.task('iconfont', function(cb){
	return gulp.src([CMD_FOLDER + '/assets/fonticons/*.svg'])
		.pipe(iconfontCss({
			fontName: 'wp_icons',
			path: 'assets/fonticons/icons_template.scss',
			targetPath: '../../../_src/_prebuilt/icons.scss',
			fontPath: '/assets/iconfont/',
		}))
		.pipe(iconfont({
			fontName: 'wp_icons',
			prependUnicode: true,
			fontHeight: 1024,
			normalize: true,
			formats: ['ttf', 'eot', 'woff'],
		}))
		.on('glyphs', function(glyphs, options) {
			glyphs = glyphs.map(function(glyph){
				glyph.unicode = glyph.unicode[0].charCodeAt(0).toString(16);
				return glyph;
			})
			fs.writeFileSync(CMD_FOLDER + '/assets/fonticons/_icons.json', JSON.stringify(glyphs));
			cb()
		})
		.pipe(gulp.dest('_src/assets/iconfont/'));
});


// * ———————————————————————————————————————————————————————— * //
// * 	JS Handlebars - Not enduro, page-generation related
// * ———————————————————————————————————————————————————————— * //
gulp.task('hbs_templates', function(){
	gulp.src(CMD_FOLDER + '/components/**/*.hbs')
		.pipe(handlebars({
			// Pass local handlebars
			handlebars: __templating_engine
		}))
		.pipe(defineModule('amd'))
		.pipe(flatten())
		.pipe(gulp.dest(CMD_FOLDER + '/_src/assets/hbs_templates'))
});


// * ———————————————————————————————————————————————————————— * //
// * 	Handlebars helpers
// * ———————————————————————————————————————————————————————— * //
gulp.task('hbs_helpers', function() {
	return gulp.src([CMD_FOLDER + '/assets/hbs_helpers/**/*.js', ENDURO_FOLDER + '/hbs_helpers/**/*.js'])
		.pipe(filterBy(function(file) {
			return file.contents.toString().indexOf('enduro_nojs') == -1;
		}))
		.pipe(concat('hbs_helpers.js'))
		.pipe(wrap('define([],function(){ return function(__templating_engine){ \n\n<%= contents %>\n\n }})'))
		.pipe(gulp.dest(CMD_FOLDER + '/_src/assets/hbs_helpers/'))
})


// * ———————————————————————————————————————————————————————— * //
// * 	html prettify
// * ———————————————————————————————————————————————————————— * //
gulp.task('html_prettify', function(){
	gulp.src('_src/**/*.html')
		.pipe(prettify({
			indent_with_tabs: true,
			'max_preserve_newlines': 0,
			"eol": "\n",
			"end_with_newline": true
		}))
		.pipe(gulp.dest('_src'))
});


// * ———————————————————————————————————————————————————————— * //
// * 	Default Task
// * ———————————————————————————————————————————————————————— * //
gulp.task('default', ['hbs_templates', 'sass', 'scss-lint', 'js', 'img', 'vendor', 'fonts', 'hbs_helpers', 'browserSync'])


// * ———————————————————————————————————————————————————————— * //
// * 	Preproduction Task
// *	Tasks that need to be done before doing the enduro render
// * ———————————————————————————————————————————————————————— * //
gulp.task('preproduction', ['iconfont'])


// * ———————————————————————————————————————————————————————— * //
// * 	Production Task
// *	No browsersync, no watching for anything
// * ———————————————————————————————————————————————————————— * //
gulp.task('production', ['sass', 'hbs_templates', 'js', 'img', 'vendor', 'fonts', 'hbs_helpers'])


// Export gulp to enable access for enduro
module.exports = gulp