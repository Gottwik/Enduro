enduro_admin_app.factory('format_service', function user_service() {
	var format_service = {}

	format_service.deslug = function(input) {
		if(!input || !input[0]) {
			return input
		}
		input = capitalize(input)

		// replaces underscore with whitespace
		input = input.replace(/\_/g, ' ')

		return input
	}

	format_service.deglobalize = function(input) {
		return this.deslug(input.split('.').slice(-1)[0])
	}

	function capitalize(input) {
		return input[0].toUpperCase() + input.substring(1)
	}

	return format_service
});