enduro_admin_app.factory('juice_service', ['$http', 'url_config', '$cookies', function juice_service($http, url_config, $cookies) {
	var juice_service = {};
	console.log('asd')
	juice_service.forcepull = function(username, password) {
		return $http.get(url_config.get_base_url() + 'juice_pull_force', {params: {sid: $cookies.get('sid')}})
			.then(function(res) {
				if(res.data) {
					return res.data
				} else {
					console.log('error getting page list')
				}
			}, function() {
				console.log('error getting page list')
			});
	}

	return juice_service
}]);