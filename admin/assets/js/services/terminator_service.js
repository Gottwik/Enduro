enduro_admin_app.factory('terminator_service', function user_service() {
	var terminator_service = {}

	terminator_service.cleanup = function(input) {
		var cleaned = {}
		for(item in input) {
			if(item[0] != '$') {
				cleaned[item] = input[item]
			}
		}
		return cleaned;
	}

	terminator_service.get_first_clean = function(input) {
		var cleaned_input = this.cleanup(input)
		return cleaned_input[Object.keys(cleaned_input)[0]]
	}

	return terminator_service
});