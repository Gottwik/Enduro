enduro_admin_app.controller('layout_controller', ['$scope', '$routeParams', 'content_service', 'format_service', function($scope, $routeParams, content_service, format_service) {


	content_service.get_cms_list()
		.then(function(data) {
			console.log('asd')
			$scope.cmslist = data
		})

}])