enduro_admin_app.factory('format_service', function user_service() {
	var format_service = {}

	format_service.deslug = function(input) {
		if(!input || !input[0]) {
			return input
		}
		input = input[0].toUpperCase() + input.substring(1)

		input = input.replace('\_', ' ')

		return input
	}

	return format_service
});