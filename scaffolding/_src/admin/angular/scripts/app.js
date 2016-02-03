/**
 * @ngdoc overview
 * @name app
 * @description
 * # app
 *
 * Main module of the application.
 */
(function() {
	'use strict';
	angular
		.module('app', [
		'ngAnimate',
		'ngResource',
		'ngSanitize',
		'ngTouch',
		'ngStorage',
		'ngStore',
		'ui.router',
		'ui.utils',
		'ui.load',
		'ui.jp',
		'oc.lazyLoad',
	  ]);

	angular
		.module('app')
		.controller('PageListGenerator', PageListGenerator);
	function PageListGenerator($scope, $http) {
		$http.get('/admin_api/get_cms')
			.then(function(res){
				$scope.pages = res.data;
			});
	}

})();
