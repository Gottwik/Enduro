// * ———————————————————————————————————————————————————————— * //
// *    Add helper
// *	Adds two numbers together
// *	Usage:
// *
// *	{{add @index 2}}
// *
// * ———————————————————————————————————————————————————————— * //
__templating_engine.registerHelper("add", function () {

	if(arguments.length <= 1) {
		return ''
	}

	return Array.prototype.slice.call(arguments).slice(0, -1).reduce(function(prev, next) {
		return prev + next
	})
});