// * ———————————————————————————————————————————————————————— * //
// *    Ternary helper
// *	Simple if helper with two possible outputs
// *	Usage:
// *
// *	{{ternary this 'was true' 'was false'}}
// *
// * ———————————————————————————————————————————————————————— * //
var helper = function () {}

helper.prototype.register = function () {

	enduro.templating_engine.registerHelper('ternary', function (condition, value_if_true, value_if_false) {

		// if no false is provided
		if (typeof value_if_false === 'object') {
			value_if_false = ''
		}

		return condition
			? value_if_true
			: value_if_false
	})
}

module.exports = new helper()
