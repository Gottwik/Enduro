// * ———————————————————————————————————————————————————————— * //
// *    Add helper
// *	Adds two numbers together
// *
// *	Usage:
// *		{{add @index 2}} // outputs @index + 2
// *
// *	also takes more arguments
// *		{{add 1 2 3}} outputs 6
// *
// *
// * ———————————————————————————————————————————————————————— * //

var helper = function () {}

helper.prototype.register = function () {
	enduro.templating_engine.registerHelper('add', function () {

		if (arguments.length <= 1) {
			return ''
		}

		return Array.prototype.slice.call(arguments).slice(0, -1).reduce(function (prev, next) {
			return prev + next
		})
	})
}

module.exports = new helper()
