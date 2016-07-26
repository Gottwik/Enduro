// * ———————————————————————————————————————————————————————— * //
// *    class helper
// *	render variable name if variable is true
// *	Usage:
// *
// *	{{class 'gradient'}}
// *
// *	Note: converts underscores to dashes
// * ———————————————————————————————————————————————————————— * //
__templating_engine.registerHelper('class', function() {
	var context = this

	if(arguments.length <= 1) {
		return ''
	}
	return Array.prototype.slice.call(arguments).slice(0, -1)
		.reduce(function(prev, next) {
			return context[next]
				? prev + ' ' + next
				: prev + ''
		}, '')
		.replace(/_/g, '-') // converts underscores to dashes
		.substring(1) // removes first space

})