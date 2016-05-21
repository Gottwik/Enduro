enduro_admin_app.directive('matchheight', function($window) {
	return{
		link: function($scope, $element, attrs){
			$scope.$watch(
				function () {
					return $($element).html()
				},
				function (newValue, oldValue) {
					var array_elements = $element.find('.js-array-item')
					var maxheight = array_elements.toArray().map(function(element) {
						return $(element).height()
					}).reduce(function(prev, next) {
						return Math.max(prev, next)
					})

					array_elements.each(function(index, element) {
						$(element).css('min-height', maxheight)
					})
				}
			);
		}
	}
});

