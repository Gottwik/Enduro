// * ———————————————————————————————————————————————————————— * //
// * 	Within helper
// *	Changes context of the block inside for array's descendant
// *	with provided key
// * ———————————————————————————————————————————————————————— * //

__templating_engine.registerHelper('within', function(array, key, options) {
	return options.fn(array[key]);
});