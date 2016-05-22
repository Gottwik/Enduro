enduro_admin_app.factory('culture_service', ['$http', 'url_config', '$cookies', function culture_service($http, url_config, $cookies) {
	var culture_service = {};

	culture_service.get_cultures = function(username, password) {
		return $http.get(url_config.get_base_url() + 'get_cultures', {params: {sid: $cookies.get('sid')}})
			.then(function(res) {
				if(res.data && res.data.success) {
					return res.data.data
				} else {
					console.log('error getting page list')
				}
			}, function() {
				console.log('error getting page list')
			});
	}

	return culture_service
}]);