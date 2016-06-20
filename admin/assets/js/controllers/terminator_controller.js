enduro_admin_app.controller('terminator_controller', ['$scope', 'format_service', 'terminator_service', function($scope, format_service, terminator_service) {

	$scope.$watch('current_culture', function() {
		// get all the terminator attributes for given key
		$scope.terminated_context = {}
		for(key in $scope.context) {

			var terminator_matches = key.match(new RegExp('\\$' + $scope.key + '_(.*)'))
			if(terminator_matches && terminator_matches.length) {
				termianted_attribute = terminator_matches[1]
				$scope.terminated_context[termianted_attribute] = $scope.context[key]
			}
		}

		// get cleaned up context
		var cleaned_context = terminator_service.cleanup($scope.context)
		$scope.key = Object.keys(cleaned_context)[$scope.$index]

		// sets formated key, which will be used as a label for admin interface
		$scope.formated_key = $scope.terminated_context.label || format_service.deslug($scope.key)

		if($scope.on_default_culture) {
			$scope.terminatedkey = $scope.key
		} else {
			$scope.terminatedkey = '$' + $scope.key + '_' + $scope.current_culture
		}

		// globalizer detection
		if(typeof $scope.value === 'string' && $scope.value.substring(0, 2) == '@@') {
			$scope.globalizer = $scope.value.substring(2)
		}
		// templatitator detection
		if('templatitator' in $scope.terminated_context) {
			$scope.templatitator = $scope.terminated_context['templatitator']
		} else {
			$scope.templatitator = false
		}

    });

}])