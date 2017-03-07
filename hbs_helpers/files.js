// * ———————————————————————————————————————————————————————— * //
// *    Files helper
// *	Find all files in path and provide them as each
// *	Usage:
// *
// *	{{#files '/assets/images/'}}
// *		<p>Image: {{this}}</p>
// *	{{/files}}
// * ———————————————————————————————————————————————————————— * //
var helper = function () {}

helper.prototype.register = function () {

	enduro.templating_engine.registerHelper('files', function (path, block) {
		var glob = require('glob')

		var files = glob.sync(enduro.project_path + path + '/**/*.*')

		var output = files.map((file) => {
			return file.replace(new RegExp('.*' + path), '')
		}).reduce((prev, next) => {
			return prev + block.fn(next)
		}, '')

		return output
	})
}

module.exports = new helper()
