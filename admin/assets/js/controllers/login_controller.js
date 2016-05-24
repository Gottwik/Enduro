enduro_admin_app.controller('login_controller', ['$scope', '$rootScope', '$http', 'user_service', '$location', function($scope, $rootScope, $http, user_service, $location) {

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