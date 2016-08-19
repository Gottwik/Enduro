// * ———————————————————————————————————————————————————————— * //
// *    multiply helper
// *	works with any number of arguments
// *	Usage:
// *
// *	{{multiply @index 2}}
// *	{{multiply 2 2 2}}
// *
// * ———————————————————————————————————————————————————————— * //
__templating_engine.registerHelper('multiply', function () {

	if (arguments.length <= 1) {
		return ''
	}

	return Array.prototype.slice.call(arguments).slice(0, -1).reduce(function (prev, next) {
		return prev * next
	})
})
