// * ———————————————————————————————————————————————————————— * //
// *    divisible helper
// *	Simple ternary-style helper that will choose between two ouputs based on if the variables provided is divisible by next argument
// *	Usage:
// *
// *	{{divisible @inde 2 'even' 'odd'}}
// *
// * ———————————————————————————————————————————————————————— * //
__templating_engine.registerHelper("divisible", function (number_to_dividee, divided_by, value_if_true, value_if_false) {

	// if no false is provided
	if(typeof value_if_false === 'object') {
		value_if_false = ''
	}

	return number_to_dividee % divided_by == 0
		? value_if_true
		: value_if_false
})