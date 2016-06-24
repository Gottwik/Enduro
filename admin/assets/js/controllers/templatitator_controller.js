enduro_admin_app.controller('templatitator_controller', ['$scope', 'content_service', 'format_service', 'terminator_service', function($scope, content_service, format_service, terminator_service) {

	$scope.temlatitator_selected = ''

	content_service.get_globalized_context($scope.templatitator)
		.then(function(templates) {
			$scope.template_list = Object.keys(templates).map((key) => {
				return {
					value: templates[key],
					label: key,
					formatted_label: format_service.deslug(key)
				}
			})
		})

	$scope.formated_globalizer = format_service.deglobalize($scope.terminated_context.templatitator)

	$scope.templatitator_change = function(context) {
		$scope.context[$scope.key].push(angular.copy(context))
	}

}])