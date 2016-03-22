(function() {
    'use strict';
    angular
		.module('app')
		.filter('fromNow', fromNow);

		function fromNow() {
		    return function(date) {
		      return moment(date).fromNow();
		    }
		}
})();
