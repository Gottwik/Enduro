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

	return terminator_service
});