// * ———————————————————————————————————————————————————————— * //
// * 	CSS Task
// *	Decides whether or to use SASS or LESS depending on the config
// * ———————————————————————————————————————————————————————— * //
var css_handler = function () {}

css_handler.prototype.init = function (gulp, browser_sync) {

	// stores task name
	var css_handler_task_name = 'css';
	var sass_handler = require(enduro.enduro_path + '/libs/build_tools/sass_handler').init(gulp, browser_sync);
	var less_handler = require(enduro.enduro_path + '/libs/build_tools/less_handler').init(gulp, browser_sync);

	gulp.task(css_handler_task_name, function() {
		if (enduro.config.less) {
			gulp.start(less_handler);
		} else {
			gulp.start(sass_handler);
		}
	})

	return css_handler_task_name;
}

module.exports = new css_handler()
