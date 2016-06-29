//var $jq = jQuery.noConflict();

var enduro_admin_app = angular.module('enduro_admin',['ngRoute', 'ngCookies', 'ngFileUpload'], function($rootScopeProvider) {
  $rootScopeProvider.digestTtl(15)
})

enduro_admin_app
	.constant('url_config', {
		get_base_url: function() {
			return (window.location.href.indexOf('localhost') + 1)
				?	'http://localhost:5000/admin_api/'
				:	'/admin_api/'
		}
	})
	.constant('path_config', {
		get_views_path: '/admin/assets/js/views/'
	})


enduro_admin_app.config(['$routeProvider',
	function($routeProvider) {
	$routeProvider
		.when('/login', {
			templateUrl: '/admin/assets/js/views/login.html',
			controller: 'pagesplit_controller'
		})
		.when('/', {
			templateUrl: '/admin/assets/js/views/main_layout.html',
			controller: 'pagesplit_controller'
		})
		.when('/cms/:page_path*', {
			templateUrl: '/admin/assets/js/views/main_layout.html',
			controller: 'pagesplit_controller'
		})
		.otherwise({ redirectTo: '/' })
	}]);


enduro_admin_app.run(['$rootScope', '$location', 'user_service', function($rootScope, $location, user_service) {

	$rootScope.$on('$locationChangeSuccess', function() {
		user_service.is_logged_in()
			.then(function(data) {
				if(!data.data.success) {
					$location.path('/login')
				}
			}, function(){
				$location.path('/login')
			})
	})

}])