enduro_admin_app.controller('page-split-controller', ['$scope', '$routeParams', 'content_service', 'format_service', function($scope, $routeParams, content_service, format_service) {

	if($routeParams.page_path) {
		$scope.inner_page = '/admin/assets/js/views/cms_edit.html'
	} else {
		$scope.inner_page = '/admin/assets/js/views/dashboard.html'
	}

	content_service.get_cms_list()
		.then(function(data) {
			$scope.cmslist = data
		})

}])