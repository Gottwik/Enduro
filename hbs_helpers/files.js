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

// vendor dependency
var glob = require('glob')
var path = require('path')

helper.prototype.register = function () {

	enduro.templating_engine.registerHelper('files', function (path_to_folder, handlebars_context) {

		var path_to_all_files_in_folder = path.join(enduro.project_path, path_to_folder, '**', '*.*')

		// get all files with path
		var files = glob.sync(path_to_all_files_in_folder)

		// get multiple properties from a absolute path
		var processed_output_html = files.map((file) => {

			// stores relative path to folder
			var relative_path = file.replace(new RegExp('.*' + path_to_folder), '')

			// returns object
			return {
				absolute_path: file,
				relative_path: relative_path,
				file_name: path.basename(relative_path),
				file_name_no_extension: path.basename(relative_path, path.extname(relative_path)),
				depth: relative_path.match(new RegExp(path.sep, 'g')).length - 1
			}

		// builds processed html
		}).reduce((prev, next) => {
			return prev + handlebars_context.fn(next)
		}, '')

		return processed_output_html
	})
}

module.exports = new helper()
