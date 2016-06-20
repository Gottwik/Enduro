enduro_admin_app.controller('pagesplit_controller', ['$scope', '$routeParams', function($scope, $routeParams) {

	if($routeParams.page_path) {
		$scope.inner_page = '/admin/assets/js/views/cms_edit.html'
	} else {
		$scope.inner_page = '/admin/assets/js/views/dashboard.html'
	}

}])