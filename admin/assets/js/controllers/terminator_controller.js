enduro_admin_app.controller('terminator_controller', ['$scope', 'format_service', 'terminator_service', function($scope, format_service, terminator_service) {

	$scope.$watch('current_culture', function() {

		var terminated_context = terminator_service.cleanup($scope.context)
		$scope.formated_key = format_service.deslug(Object.keys(terminated_context)[$scope.$index])

		console.log($scope.current_culture)
		if($scope.on_default_culture) {
			$scope.terminatedkey = $scope.key
		} else {
			$scope.terminatedkey = '$' + $scope.key + '_' + $scope.current_culture
		}
    });

}])