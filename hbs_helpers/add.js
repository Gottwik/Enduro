// * ———————————————————————————————————————————————————————— * //
// *    Add helper
// *	Adds two numbers together
// *	Usage:
// *
// *	{{add @index 2}}
// *
// * ———————————————————————————————————————————————————————— * //
__templating_engine.registerHelper("add", function (variable, addvalue) {
	return variable + addvalue
});