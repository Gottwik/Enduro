enduro_admin_app.factory('menu_cache', ['$cacheFactory', function($cacheFactory){
        return $cacheFactory('mainmenu_data');
    }]);

enduro_admin_app.factory('content_service', ['$http', 'url_config', '$cookies', 'menu_cache', '$q', function user_service($http, url_config, $cookies, menu_cache, $q) {
	var content_service = {};

	content_service.get_cms_list = function(username, password) {

		if(menu_cache.get('mainmenu_data')) {
			var deferred = $q.defer()
			deferred.resolve(menu_cache.get('mainmenu_data'))
			return deferred.promise
		}

		return $http.get(url_config.get_base_url() + 'get_cms_list', {params: {sid: $cookies.get('sid')}})
			.then(function(res) {
				menu_cache.put('mainmenu_data', res.data.data)
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
	}

	content_service.get_globalized_options = function(globalizer_string) {
		return $http.get(url_config.get_base_url() + 'get_globalizer_options', {params: {sid: $cookies.get('sid'), globalizer_string: globalizer_string}})
			.then(function(res) {
				return res.data
			})
	}

	content_service.get_globalized_context = function(globalizer_string) {
		return $http.get(url_config.get_base_url() + 'get_globalized_context', {params: {sid: $cookies.get('sid'), globalizer_string: globalizer_string}})
			.then(function(res) {
				return res.data
			})
	}

	content_service.add_page = function(new_pagename, generator) {
		return $http.get(url_config.get_base_url() + 'add_page', {params: {sid: $cookies.get('sid'), new_pagename: new_pagename, generator: generator}})
	}

	return content_service
}]);