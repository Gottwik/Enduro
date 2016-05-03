// * ———————————————————————————————————————————————————————— * //
// *    Ternary helper
// *	Simple if helper with two possible outputs
// *	Usage:
// *
// *	{{ternary this 'was true' 'was false'}}
// *
// * ———————————————————————————————————————————————————————— * //
__templating_engine.registerHelper("ternary", function (condition, value_if_true, value_if_false) {
	return condition
		? value_if_true
		: value_if_false
});