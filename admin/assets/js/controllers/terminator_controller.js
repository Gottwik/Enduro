enduro_admin_app.controller('terminator_controller', ['$scope', 'format_service', 'terminator_service', function($scope, format_service, terminator_service) {

	$scope.$watch('current_culture', function() {

		var terminated_context = terminator_service.cleanup($scope.context)
		$scope.key = Object.keys(terminated_context)[$scope.$index]
		$scope.formated_key = format_service.deslug($scope.key)

		if($scope.on_default_culture) {
			$scope.terminatedkey = $scope.key
		} else {
			$scope.terminatedkey = '$' + $scope.key + '_' + $scope.current_culture
		}

		$scope.terminated_context = {}
		for(key in $scope.context) {

			var terminator_matches = key.match(new RegExp('\\$' + $scope.key + '_(.*)'))
			if(terminator_matches && terminator_matches.length) {
				termianted_attribute = terminator_matches[1]
				$scope.terminated_context[termianted_attribute] = $scope.context[key]
			}
		}
    });

}])