enduro_admin_app.controller('login_controller', ['$scope', '$rootScope', '$http', 'user_service', '$location', function($scope, $rootScope, $http, user_service, $location) {
	$scope.submit = function() {
		user_service.login_by_password($scope.enduro_username, $scope.enduro_password)
			.then(function(data){
				if(data.success) {
					$location.path('/')
				} else {
					$location.path('/login')
				}
			})
	}
}])