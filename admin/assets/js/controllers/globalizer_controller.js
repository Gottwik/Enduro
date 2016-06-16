enduro_admin_app.controller('globalizer_controller', ['$scope', 'content_service', 'format_service', '$rootScope', function($scope, content_service, format_service, $rootScope) {

	content_service.get_globalized_options($scope.globalizer)
		.then(function(globalized_options) {
			$scope.globalized_options = globalized_options.map((option) => {
				return {
					value: option,
					label: format_service.deglobalize(option)
				}
			})
		})

	$scope.formated_globalizer = format_service.deglobalize($scope.value)

	$scope.globalizer_change = function(globalizer_handle) {
		if($scope.terminated_context.modulizer) {
			content_service.get_globalized_context(globalizer_handle)
				.then(function(globalized_context) {
					$scope.context['module_context'] = globalized_context
				})
		}
	}

}])