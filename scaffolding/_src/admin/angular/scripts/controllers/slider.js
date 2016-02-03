// code style: https://github.com/johnpapa/angular-styleguide 

(function() {
    'use strict';
    angular
        .module('app')
        .controller('SliderCtrl', SliderCtrl);

        function SliderCtrl($scope) {
        	var vm = $scope;
			vm.cost = 40;
			vm.range = {
				min: 30,
				max: 60
			};
			vm.currencyFormatting = currencyFormatting;

			function currencyFormatting(value) { 
				return "$"+value.toString();
			}
		}
})();
