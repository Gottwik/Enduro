enduro_admin_app.controller('array_controller', ['$scope', 'format_service', function($scope, format_service) {
	$scope.object_name = format_service.deslug($scope.key)
	$scope.no_frame = false
	if($scope.value) {
		$scope.context = $scope.value
	}

	$scope.additem = function() {
		$scope.context.push($scope.context[0])
	}
}])