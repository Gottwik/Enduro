// * ———————————————————————————————————————————————————————— * //
// *    Files helper
// *	Find all files in path and provide them as each
// *	Usage:
// *
// *	{{#files '/assets/images/'}}
// *		<p>Image: {{this}}</p>
// *	{{/files}}
// * ———————————————————————————————————————————————————————— * //
__templating_engine.registerHelper('files', function (path, block) {
	var glob = require('glob')

	var files = glob.sync(CMD_FOLDER + path + '/**/*.*')

	var output = files.map((file) => {
		return file.replace(new RegExp('.*' + path), '')
	}).reduce((prev, next) => {
		return prev + block.fn(next)
	}, '')

	return output
})
