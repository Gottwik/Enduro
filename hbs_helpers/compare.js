// * ———————————————————————————————————————————————————————— * //
// *    Compare helper
// *	Simple ternary-style helper that will choose between two ouputs based on if the variables provided are equal
// *	Usage:
// *
// *	{{Compare age 20 'this dude is exactly 20 years old' 'he's not 20 years old}}
// *
// * ———————————————————————————————————————————————————————— * //
var helper = function () {}

helper.prototype.register = function () {

	enduro.templating_engine.registerHelper('compare', function (variable1, variable2, value_if_true, value_if_false) {
		return variable1 == variable2
			? value_if_true
			: value_if_false
	})

}

module.exports = new helper()
