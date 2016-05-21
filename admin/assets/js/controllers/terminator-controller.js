enduro_admin_app.controller('terminator_controller', ['$scope', 'format_service', 'terminator_service', function($scope, format_service, terminator_service) {
	var terminated_context = terminator_service.cleanup($scope.context)
	$scope.formated_key = format_service.deslug(Object.keys(terminated_context)[$scope.$index])
}])