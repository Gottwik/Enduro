// * ———————————————————————————————————————————————————————— * //
// *    Grouped each helper
// *    Will split array into chunks of specified size
// *    taken from https://funkjedi.com/technology/412-every-nth-item-in-handlebars/
// * ———————————————————————————————————————————————————————— * //
var helper = function () {}

helper.prototype.register = function () {

	enduro.templating_engine.registerHelper('grouped_each', function (every, context, options) {

		if (!context || !(Object.keys(context).length || context.length)) {
			return ''
		}

		var out = ''
		var subcontext = []
		var i = 0

		for (var key in context) {
			if (i > 0 && i % every === 0) {
				out += options.fn(subcontext)
				subcontext = []
			}
			subcontext.push(context[key])
			i++
		}
		out += options.fn(subcontext)

		// Outputs processed html
		return out
	})
}

module.exports = new helper()
