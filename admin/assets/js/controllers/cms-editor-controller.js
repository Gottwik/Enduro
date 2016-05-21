enduro_admin_app.controller('cms-editor-controller', ['$scope', '$routeParams', 'content_service', function($scope, $routeParams, content_service) {

	// Get pages
	content_service.get_content($routeParams.page_path)
		.then(function(res){
			$scope.page_name = res.page_name
			$scope.context = res.context
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