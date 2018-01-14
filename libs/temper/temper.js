// * ———————————————————————————————————————————————————————— * //
// * 	temper
// *	temporarily renders one page based on provided context
// * ———————————————————————————————————————————————————————— * //
const temper = function () {}

// * vendor dependencies
const extend = require('extend')

// * enduro dependencies
const page_renderer = require(enduro.enduro_path + '/libs/page_rendering/page_renderer')
const abstractor = require(enduro.enduro_path + '/libs/abstractor/abstractor')

// Goes through the pages and renders them
temper.prototype.render = function (filename, context) {

	// use empty object if no context is provided
	context = context || {}

	context = extend(true, context, { absolute_prefix: '../' })

	return abstractor.abstract_context(context)
		.then((context) => {
			return page_renderer.render_file_by_template_path_replace_context(filename, context)
		})
}

module.exports = new temper()
