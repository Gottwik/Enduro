// * ———————————————————————————————————————————————————————— * //
// * 	format service
// * ———————————————————————————————————————————————————————— * //

var format_service = function () {};


// Capitalize and replace dashes and underscores
format_service.prototype.prettify_string = function (input) {
	return capitalize(input).replace(/[\_|-]/g, ' ')
}

function capitalize(input) {
	return input[0].toUpperCase() + input.substring(1)
}


module.exports = new format_service()