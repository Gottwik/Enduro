// * ———————————————————————————————————————————————————————— * //
// *    class helper
// *	render variable name if variable is true
// *	Usage:
// *
// *		{{class 'gradient'}} // will render 'gradient' if class context.gradient is truthy
// *
// *	also takes multiple arguments
// *
// *		{{class 'gradient' 'dark' 'border'}}
// *
// *	Note: converts underscores to dashes
// *
// *		{{class 'gradient_bottom'}} // will render gradient-bottom
// *
// * ———————————————————————————————————————————————————————— * //
var helper = function () {}

helper.prototype.register = function () {
	enduro.templating_engine.registerHelper('class', function () {
		var context = this

		// if no argument is provided renders empty string
		if (arguments.length <= 1) {
			return ''
		}

		return Array.prototype.slice.call(arguments).slice(0, -1) // takes all arguments without the handlebars context
			.reduce(function (prev, next) {
				return context[next]
					? prev + ' ' + next // adds argument name if the value is truthy
					: prev + ''
			}, '')
			.replace(/_/g, '-') // converts underscores to dashes
			.substring(1) // removes first space

	})
}

module.exports = new helper()
