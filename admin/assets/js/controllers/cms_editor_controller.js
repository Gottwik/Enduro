enduro_admin_app.controller('cms-editor-controller', ['$scope', '$rootScope', '$routeParams', 'content_service', 'culture_service', function($scope, $rootScope, $routeParams, content_service, culture_service) {

	// Get pages
	content_service.get_content($routeParams.page_path)
		.then(function(res){
			$scope.page_name = res.page_name
			$scope.context = res.context
		})

	culture_service.get_cultures()
		.then(function(res){
			$scope.cultures = res;
			$scope.current_culture = res[0] || ''
			$scope.on_default_culture = $scope.current_culture == res[0]
		})

	$scope.change_culture = function(obj) {
		$scope.current_culture = $(obj.target).data('culture')
		$scope.on_default_culture = $(obj.target).data('culture') == $scope.cultures[0]
	}

	$scope.publish = function() {
		content_service.save_content($routeParams.page_path, $scope.context)
	}

	// Helper functions
	$scope.isString = function(item) { return angular.isString(item) }
	$scope.isNumber = function(item) { return angular.isNumber(item) }
	$scope.isArray = function(item) { return angular.isArray(item) }
	$scope.isBoolean = function(item) { return typeof(item) === "boolean" }
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