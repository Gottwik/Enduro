enduro_admin_app.controller('logout_controller', ['$scope', 'user_service', '$location', 'juice_service', function($scope, user_service, $location, juice_service) {

	$scope.logout = () => {
		user_service.logout()
			.then(() => {
				$location.path('/login')
			})
	}

	$scope.forcepull = () => {
		juice_service.forcepull()
			.then(() => {
				$location.path('/')
			})
	}


}])