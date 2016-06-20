enduro_admin_app
	.directive('ngtooltipster', [function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				$(element).tooltipster({
					content: scope.terminated_context.info
				});
			}
		}
	}]);