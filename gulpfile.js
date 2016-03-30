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
var iconfontCss = require('gulp-iconfont-css');
var handlebars = require('gulp-handlebars');
var defineModule = require('gulp-define-module');
var flatten = require('gulp-flatten');

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
			baseDir: cmd_folder + '/_src',
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
		logPrefix: 'Enduro',
	});

	watch([ cmd_folder + '/assets/css/**/*', cmd_folder + '/assets/fonticons/*', '!' + cmd_folder + '/assets/css/sprites/*'],
				() => { gulp.start('scss-lint', 'sass') })										// Watch for scss
	watch([cmd_folder + '/assets/js/**/*'], () => { gulp.start('js') })							// Watch for js
	watch([cmd_folder + '/assets/img/**/*'], () => { gulp.start('img') })						// Watch for images
	watch([cmd_folder + '/assets/vendor/**/*'], () => { gulp.start('vendor') })					// Watch for vendor files
	watch([cmd_folder + '/assets/fonts/**/*'], () => { gulp.start('fonts') })					// Watch for fonts
	watch([cmd_folder + '/assets/spriteicons/*.png'], () => { gulp.start('sass') })				// Watch for png icons
	watch([cmd_folder + '/assets/fonticons/*.svg'], () => {
		gulp.start('iconfont')
		gulp.enduroRefresh(() => {})
	})			// Watch for font icon
	watch([cmd_folder + '/_src/**/*.html'], () => { browserSync.reload() })						// Watch for html files
	watch([cmd_folder + '/components/**/*.hbs'], () => { gulp.start('hbs_templates') })			// Watch for hbs templates

	// Watch for enduro changes
	watch([cmd_folder + '/pages/**/*.hbs', cmd_folder + '/components/**/*.hbs', cmd_folder + '/cms/**/*.js'], function() {
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
	return gulp.src(cmd_folder + '/assets/css/main.scss')
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
		.pipe(gulp.dest(cmd_folder + '/_src/assets/css'))
		.pipe(browserSync.stream())
});


// * ———————————————————————————————————————————————————————— * //
// * 	Scss lint
// * ———————————————————————————————————————————————————————— * //
gulp.task('scss-lint', function() {
	try{
		return gulp.src(cmd_folder + '/assets/css/**/*')
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

	return gulp.src(cmd_folder + '/assets/js/**/*')
		.pipe(gulp.dest(cmd_folder + '/_src/assets/js'))

})


// * ———————————————————————————————————————————————————————— * //
// * 	img
// * ———————————————————————————————————————————————————————— * //
gulp.task('img', function() {
	return gulp.src(cmd_folder + '/assets/img/**/*')
		.pipe(gulp.dest(cmd_folder + '/_src/assets/img'))
})


// * ———————————————————————————————————————————————————————— * //
// * 	vendor
// * ———————————————————————————————————————————————————————— * //
gulp.task('vendor', function() {
	return gulp.src(cmd_folder + '/assets/vendor/**/*')
		.pipe(gulp.dest(cmd_folder + '/_src/assets/vendor'))
})


// * ———————————————————————————————————————————————————————— * //
// * 	fonts
// * ———————————————————————————————————————————————————————— * //
gulp.task('fonts', function() {
	return gulp.src(cmd_folder + '/assets/fonts/**/*')
		.pipe(gulp.dest(cmd_folder + '/_src/assets/fonts'))
})


// * ———————————————————————————————————————————————————————— * //
// * 	spriteicons
// *	will get all pngs out of assets/spriteicons folder
// *	and generate spritesheet out of them
// * ———————————————————————————————————————————————————————— * //
gulp.task('png_sprites', function() {
	return gulp.src(cmd_folder + '/assets/spriteicons/*.png')
		.pipe(spritesmith({
			imgName: '_src/assets/spriteicons/spritesheet.png',
			cssName: 'assets/css/sprites/sprites.scss',
			padding: 3,
			cssTemplate: __dirname + '/support_files/sprite_generator.handlebars',
			retinaSrcFilter: [cmd_folder + '/assets/spriteicons/*@2x.png'],
			retinaImgName: '_src/assets/spriteicons/spritesheet@2x.png',
		}))
		.pipe(gulp.dest(cmd_folder));
})


// * ———————————————————————————————————————————————————————— * //
// * 	iconfont
// * ———————————————————————————————————————————————————————— * //
gulp.task('iconfont', function(cb){
	return gulp.src([cmd_folder + '/assets/fonticons/*.svg'])
		.pipe(iconfontCss({
			fontName: 'wp_icons',
			path: 'assets/fonticons/icons_template.scss',
			targetPath: '../../../assets/fonticons/_icons.scss',
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
			fs.writeFileSync(cmd_folder + '/assets/fonticons/_icons.json', JSON.stringify(glyphs));
			cb()
		})
		.pipe(gulp.dest('_src/assets/iconfont/'));
});


// * ———————————————————————————————————————————————————————— * //
// * 	JS Handlebars - Not enduro, page-generation related
// * ———————————————————————————————————————————————————————— * //
gulp.task('hbs_templates', function(){
	gulp.src(cmd_folder + '/components/**/*.hbs')
		.pipe(handlebars({
			// Pass your local handlebars version
			handlebars: require('handlebars')
		}))
		.pipe(defineModule('amd'))
		.pipe(flatten())
		.pipe(gulp.dest(cmd_folder + '/_src/assets/hbs_templates'));
});


// * ———————————————————————————————————————————————————————— * //
// * 	Default Task
// * ———————————————————————————————————————————————————————— * //
gulp.task('default', ['hbs_templates', 'sass', 'scss-lint', 'js', 'img', 'vendor', 'fonts', 'browserSync'])

// * ———————————————————————————————————————————————————————— * //
// * 	Preproduction Task
// *	Tasks that need to be done before doing the enduro render
// * ———————————————————————————————————————————————————————— * //
gulp.task('preproduction', ['iconfont'])

// * ———————————————————————————————————————————————————————— * //
// * 	Production Task
// *	No browsersync, no watching for anything
// * ———————————————————————————————————————————————————————— * //
gulp.task('production', ['sass', 'hbs_templates', 'js', 'img', 'vendor', 'fonts'])


// Export gulp to enable access for enduro
module.exports = gulp