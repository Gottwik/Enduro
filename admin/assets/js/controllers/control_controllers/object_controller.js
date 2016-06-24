enduro_admin_app.controller('object_controller', ['$scope', 'format_service', '$rootScope', function($scope, format_service, $rootScope) {

	$scope.object_name = format_service.deslug($scope.key)

	$scope.parent_no_frame = $scope.no_frame
	$scope.no_frame = false

	if($scope.value) {
		$scope.context = $scope.value
	}

	$scope.expand = function() {
		$scope.open = !$scope.open
	}

}])