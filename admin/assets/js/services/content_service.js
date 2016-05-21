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