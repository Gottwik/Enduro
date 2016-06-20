enduro_admin_app.controller('addpage_controller', ['$scope', 'menu_cache', '$rootScope', 'content_service', function($scope, menu_cache, $rootScope, content_service) {

	console.log()

	$scope.addpage = function() {

		// closes the modal

		$rootScope.modal = ''

		content_service.add_page($scope.new_pagename, $rootScope.adding_generator.fullpath.split('/').slice(2,-1)[0])

	}

}])