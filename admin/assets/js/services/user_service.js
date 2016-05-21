enduro_admin_app.factory('user_service', ['$http', 'url_config', '$cookies', '$q', function user_service($http, url_config, $cookies, $q) {
	var service = {};
	service.login_by_password = function(username, password) {
		return $http.get(url_config.get_base_url() + 'login_by_password', {params: {username: username, password: password}})
			.then(function(res) {
				$cookies.put('sid', res.data.sid);
				return res.data
			}, function() {
				console.log('error logging in')
			});
	}

	service.is_logged_in = function() {
		// refuse login if no cookie is set
		if(!$cookies.get('sid')) {
			return $q.reject(false);
		}
		return $http.get(url_config.get_base_url() + 'check_session', {params: {sid: $cookies.get('sid')}})
	}

	service.logout = function() {
		// refuse login if no cookie is set
		if(!$cookies.get('sid')) {
			return $q.reject(false);
		}

		return $http.get(url_config.get_base_url() + 'logout', {params: {sid: $cookies.get('sid')}})
	}

	return service;
}]);