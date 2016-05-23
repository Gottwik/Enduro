enduro_admin_app.controller('globalizer_controller', ['$scope', 'content_service', 'format_service', function($scope, content_service, format_service) {

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

}])