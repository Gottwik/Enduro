// enduro_nojs
// * ———————————————————————————————————————————————————————— * //
// *	get_context helper
// *	reads a context file, relative to the cms folder and provides it as context
// *	Usage:
// *
// *	{{#get_context 'index'}}
// *		<p class="{{age}}">test text</p> << File contents is used as context here
// *	{{/get_context}}
// *
// * ———————————————————————————————————————————————————————— * //

var helper = function () {}

var flat = require(enduro.enduro_path + '/libs/flat_db/flat')

helper.prototype.register = function () {

	enduro.templating_engine.registerHelper('get_context', function (context_file, options) {
		return flat.load(context_file)
			.then((context) => {
				return options.fn(context)
			})
	})
}

module.exports = new helper()
