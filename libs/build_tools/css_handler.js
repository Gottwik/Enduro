// * ———————————————————————————————————————————————————————— * //
// * 	CSS Task
// *	Decides whether or to use SASS, LESS or STYLUS depending on the config
// * ———————————————————————————————————————————————————————— * //
const css_handler = function () {}

css_handler.prototype.init = function (gulp, browser_sync) {

	// stores task name
	const css_handler_task_name = 'css';
	const sass_handler = require(enduro.enduro_path + '/libs/build_tools/sass_handler').init(gulp, browser_sync);
	const less_handler = require(enduro.enduro_path + '/libs/build_tools/less_handler').init(gulp, browser_sync);
	const stylus_handler = require(enduro.enduro_path + '/libs/build_tools/stylus_handler').init(gulp, browser_sync);

	gulp.task(css_handler_task_name, function() {
		if (enduro.config.less) {
			gulp.start(less_handler);
		} else if (enduro.config.stylus) {
			gulp.start(stylus_handler)
		} else {
			gulp.start(sass_handler);
		}
	})

	return css_handler_task_name;
}

module.exports = new css_handler()
