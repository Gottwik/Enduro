// * ———————————————————————————————————————————————————————— * //
// * 	format service
// * ———————————————————————————————————————————————————————— * //
var format_service = function () {}

// gets rid of non-word characters and replaces whitespace with a dash
format_service.prototype.slug = function (input) {
	return input.toString().toLowerCase()
		.replace(/\s+/g, '-')			// Replace spaces with -
		.replace(/[^\w\-]+/g, '')		// Remove all non-word chars
		.replace(/\-\-+/g, '-')			// Replace multiple - with single -
		.replace(/^-+/, '')				// Trim - from start of text
		.replace(/-+$/, '')				// Trim - from end of text
}

// same as slug but replaces whitespace with underscore
format_service.prototype.enduro_slug = function (input) {
	return input.toString().toLowerCase()
		.replace(/\s+/g, '_')			// Replace spaces with _ (underline)
		.replace(/[^\w\-_]+/g, '')		// Remove all non-word chars except underline and dashes
		.replace(/\-\-+/g, '-')			// Replace multiple - with single -
		.replace(/__+/g, '-')			// Replace multiple _ with single _
		.replace(/^-+/, '')				// Trim - from start of text
		.replace(/-+$/, '')				// Trim - from end of text
		.replace(/^_+/, '')				// Trim _ from start of text
		.replace(/_+$/, '')				// Trim _ from end of text
}

// capitalize and replace dashes and underscores
format_service.prototype.prettify_string = function (input) {
	return capitalize(input)
		.replace(/[_|-]/g, ' ')
}

function capitalize (input) {
	return input[0].toUpperCase() + input.substring(1)
}

module.exports = new format_service()
