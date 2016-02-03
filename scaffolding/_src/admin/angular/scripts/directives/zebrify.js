(function() {
	'use strict';
	angular
		.module('app')
		.directive('zebrify', ['$http', function($http) {
			return {
				compile: function(tElem,attrs) {
					//do optional DOM transformation here
					return function(scope,elem,attrs) {
						var cms_name = scope.q
						$http.get('/admin_api/get_cms?cms_name='+cms_name, {cache: false})
							.then(function(res){
								fillZebra(elem, scope.rawJson = res.data, cms_name, $http)
							});
					};
				}
			};
		}]);

		function fillZebra(zebraWrapper, rawJson, cms_name, $http){
			angular.forEach(rawJson, function(value, key){
				var stripe = $('<label for="'+key+'">'+key+'</label><input type="text" name="' + key + '" value="' + value + '">')
				$(zebraWrapper).append(stripe).append('<br>')
			})
			var submit = $('<input type="submit">')

			$(zebraWrapper).submit(function(){
				var formdata = $(zebraWrapper).serializeArray();
				var serialized = {};
				$(formdata ).each(function(index, obj){
					serialized[obj.name] = obj.value;
				});
				console.log(serialized)
				$http({
					method: 'GET',
					url: '/admin_api/save_cms',
					params: {
						cms_name: cms_name,
						contents: serialized
					}
				})
				.then(function(res){
					$http.get('/admin_api_refresh')
						.then(function(data){
							console.log(data, 'Enduro Refreshed')
						})
				})
			})
			$(zebraWrapper).append(submit)
		}	
})();
