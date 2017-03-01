// * ———————————————————————————————————————————————————————— * //
// * 	Within helper
// *	Changes context of the block inside for array's descendant
// *	with provided key
// *	Usage:
// *
// *	{{#within people mike}}
// *		<p>Mike's age is: {{age}}</p>
// *	{{/within}}
// *
// * ———————————————————————————————————————————————————————— * //

enduro.templating_engine.registerHelper('within', function (array, key, options) {
	return options.fn(array[key])
})
