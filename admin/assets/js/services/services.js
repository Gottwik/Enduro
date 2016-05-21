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



enduro_admin_app.factory('content_service', ['$http', 'url_config', '$cookies', function user_service($http, url_config, $cookies) {
	var content_service = {};

	content_service.get_pagelist = function(username, password) {
		return $http.get(url_config.get_base_url() + 'get_page_list', {params: {sid: $cookies.get('sid')}})
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

	content_service.get_content = function(page_path) {
		return $http.get(url_config.get_base_url() + 'get_cms', {params: {sid: $cookies.get('sid'), filename: page_path}})
			.then(function(res) {
				return res.data
			})
	}

	content_service.save_content = function(page_path, content) {
		return $http.get(url_config.get_base_url() + 'save_cms', {params: {sid: $cookies.get('sid'), content: content, filename: page_path}})
			.then(function(res) {
				return res.data
			})
	}

	return content_service
}]);

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