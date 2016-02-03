/**
 * @ngdoc function
 * @name app.config:uiRouter
 * @description
 * # Config
 * Config for the router
 */
(function() {
		'use strict';
		angular
			.module('app')
			.run(runBlock)
			.config(config);

			runBlock.$inject = ['$rootScope', '$state', '$stateParams'];
			function runBlock($rootScope,   $state,   $stateParams) {
					$rootScope.$state = $state;
					$rootScope.$stateParams = $stateParams;        
			}

			config.$inject =  ['$stateProvider', '$urlRouterProvider', 'MODULE_CONFIG'];
			function config( $stateProvider,   $urlRouterProvider,   MODULE_CONFIG ) {
				
				var p = getParams('layout'),
						l = p ? p + '.' : '',
						layout = 'views/layout/layout.'+l+'html',
						dashboard = 'views/dashboard/dashboard.'+l+'html';

				$urlRouterProvider
					.otherwise('/app/dashboard');
				$stateProvider
					.state('app', {
						abstract: true,
						url: '/app',
						views: {
							'': {
								templateUrl: layout
							}
						}
					})
						.state('app.dashboard', {
							url: '/dashboard',
							templateUrl: dashboard,
							data : { title: 'Dashboard' },
							controller: "ChartCtrl",
							resolve: load(['angular/scripts/controllers/chart.js'])
						})

						// ui router
						.state('app.zebra', {
								url: '/zebra?q',
								templateUrl: 'views/kiska7/zebra.html',
								controller: function($scope, $stateParams) {
									$scope.q = $stateParams.q
								}
							})

					;

				function load(srcs, callback) {
					return {
							deps: ['$ocLazyLoad', '$q',
								function( $ocLazyLoad, $q ){
									var deferred = $q.defer();
									var promise  = false;
									srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
									if(!promise){
										promise = deferred.promise;
									}
									angular.forEach(srcs, function(src) {
										promise = promise.then( function(){
											angular.forEach(MODULE_CONFIG, function(module) {
												if( module.name == src){
													src = module.module ? module.name : module.files;
												}
											});
											return $ocLazyLoad.load(src);
										} );
									});
									deferred.resolve();
									return callback ? promise.then(function(){ return callback(); }) : promise;
							}]
					}
				}

				function getParams(name) {
						name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
						var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
								results = regex.exec(location.search);
						return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
				}
			}
})();
