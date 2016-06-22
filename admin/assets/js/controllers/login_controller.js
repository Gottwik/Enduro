enduro_admin_app.controller('login_controller', ['$scope', '$rootScope', '$http', 'user_service', '$location', 'content_service', function($scope, $rootScope, $http, user_service, $location, content_service) {

	$scope.juicebox_enabled = true

	content_service.get_juicebox_enabled()
		.then((juicebox_enabled) => {
			console.log('juicebox enabled', juicebox_enabled.data)
			$scope.juicebox_enabled = juicebox_enabled.data
		})

	// login form submit form
	$scope.submit = function() {
		user_service.login_by_password($scope.enduro_username, $scope.enduro_password)
			.then(function(data){
				if(data.success) {
					$location.path('/cms/index')
				} else {
					$location.path('/login')
				}
			})
	}

}])