enduro_admin_app.controller('mainmenu_controller', ['$scope', 'content_service', '$rootScope', function($scope, content_service, $rootScope) {

	content_service.get_cms_list()
		.then(function(data) {
			$rootScope.cmslist = data
		})

}])