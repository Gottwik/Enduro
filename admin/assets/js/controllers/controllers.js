enduro_admin_app.controller('login_controller', ['$scope', '$rootScope', '$http', 'user_service', '$location', function($scope, $rootScope, $http, user_service, $location) {
	$scope.submit = function() {
		user_service.login_by_password($scope.username, $scope.password)
			.then(function(data){
				if(data.success) {
					$location.path('/dashboard')
				} else {
					$location.path('/login')
				}
			})
	}
}])

enduro_admin_app.controller('main_ctrl', ['$scope', '$routeParams', 'content_service', function($scope, $routeParams, content_service) {

	if($routeParams.page_path) {
		$scope.inner_page = '/admin/assets/js/views/cms_edit.html'
	} else {
		$scope.inner_page = '/admin/assets/js/views/dashboard.html'
	}

	content_service.get_pagelist()
		.then(function(data) {
			$scope.pagelist = data
		})
}])

enduro_admin_app.controller('cms-edit-ctrl', ['$scope', '$routeParams', 'content_service', function($scope, $routeParams, content_service) {

	// Get pages
	content_service.get_content($routeParams.page_path)
		.then(function(context){
			$scope.context = context
		})

	$scope.publish = function() {
		content_service.save_content($routeParams.page_path, $scope.context)
	}

	// Helper functions
	$scope.isString = function(item) { return angular.isString(item); }
	$scope.isNumber = function(item) { return angular.isNumber(item); }
	$scope.isArray = function(item) { return angular.isArray(item); }
	$scope.isObject = function(item) {
		if(typeof item === 'object') {
			if(angular.isArray(item)) {
				return false
			}
			return true
		}
		return false
	}

}])

enduro_admin_app.controller('cms_main_ctrl', ['$scope', function($scope) {
	if($scope.value) {
		$scope.context = $scope.value
	}
}])
