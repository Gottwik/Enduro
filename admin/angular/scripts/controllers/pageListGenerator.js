// code style: https://github.com/johnpapa/angular-styleguide 

(function() {
		'use strict';
		angular
			.module('app')
			.controller('PageListGenerator', PageListGenerator);

		function PageListGenerator($scope, $http) {
			$http.get('http://localhost:3000/admin_api/get_cms')
				.then(function(res){
					$scope.pages = res.data;
				});
		}
})();
