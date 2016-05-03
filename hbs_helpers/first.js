// * ———————————————————————————————————————————————————————— * //
// *    First helper
// *	Gets the first element of an array or object
// *	Usage:
// *
// *	{{#first people}}
// *		<p>First person's age is: {{age}}</p>
// *	{{/first}}
// * ———————————————————————————————————————————————————————— * //
__templating_engine.registerHelper('first', function(array, options) {
	return options.fn(array[Object.keys(array)[0]]);
});