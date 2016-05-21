enduro_admin_app.controller('logout_controller', ['$scope', 'user_service', '$location', function($scope, user_service, $location) {
	$scope.logout = () => {
		user_service.logout()
			.then(() => {
				$location.path('/login')
			})
	}
}])