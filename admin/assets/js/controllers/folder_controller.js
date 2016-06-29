enduro_admin_app.controller('folder_controller', ['$scope', 'menu_cache', '$rootScope', function($scope, menu_cache, $rootScope) {

	$scope.cmslist = $scope.page

	$scope.folderclick = function() {
		$scope.cmslist.open = !$scope.cmslist.open
		menu_cache.put('mainmenu_data', $rootScope.cmslist)
	}

	$scope.add_page = function() {
		$rootScope.adding_generator = $scope.page
		$rootScope.modal = '/admin/assets/js/views/modals/create_new_page.html'
	}

}])