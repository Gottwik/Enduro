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

	angular
		.module('app')
		.controller('Zebra', Zebra);
	function Zebra($scope, $http) {
		var cms_name = $scope.$parent.q
		$http.get('/admin_api/get_cms?cms_name='+cms_name, {cache: false})
			.then(function(res){
				$scope.rawJson = res.data;
			});

		$scope.submit = function(){
			console.log($scope.rawJsonArea)
			$http({
				method: 'GET',
				url: '/admin_api/save_cms',
				params: {
					cms_name: cms_name,
					contents: 'module.exports = ' + $scope.rawJson
				}
			})
			.then(function(res){
				$http.get('/admin_api_refresh')
					.then(function(){
						console.log('Enduro Refreshed')
					})
			})
		}
	}

})();
