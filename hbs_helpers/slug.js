// * ———————————————————————————————————————————————————————— * //
// *    slug helper
// *	Usage:
// *
// *	{{slug 'This Link'}}
// *
// *	will return this-link
// * ———————————————————————————————————————————————————————— * //

__templating_engine.registerHelper('slug', function (input) {
	return text.toString().toLowerCase()
		.replace(/\s+/g, '-')			// Replace spaces with -
		.replace(/[^\w\-]+/g, '')		// Remove all non-word chars
		.replace(/\-\-+/g, '-')			// Replace multiple - with single -
		.replace(/^-+/, '')				// Trim - from start of text
		.replace(/-+$/, '');			// Trim - from end of text
});