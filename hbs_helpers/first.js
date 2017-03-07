// * ———————————————————————————————————————————————————————— * //
// *    First helper
// *	Gets the first element of an array or object
// *
// *	Usage:
// *		{{#first people}}
// *			<p>First person's age is: {{age}}</p>
// *		{{/first}}
// * ———————————————————————————————————————————————————————— * //
var helper = function () {}

helper.prototype.register = function () {

	enduro.templating_engine.registerHelper('first', function (array, options) {
		return options.fn(array[Object.keys(array)[0]])
	})
}

module.exports = new helper()
