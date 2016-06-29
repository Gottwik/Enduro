enduro_admin_app.controller('addpage_controller', ['$scope', 'menu_cache', '$rootScope', 'content_service', 'format_service', '$location', function($scope, menu_cache, $rootScope, content_service, format_service, $location) {

	$scope.addpage = function() {

		// closes the modal
		$rootScope.modal = ''

		var slugged_newname = format_service.slug($scope.new_pagename)

		content_service.add_page(slugged_newname, $rootScope.adding_generator.fullpath.split('/').slice(2,-1)[0])
			.then(function() {
				add_page_to_cmslist($rootScope.cmslist, $rootScope.adding_generator.fullpath.split('/').slice(1,-1) , slugged_newname)
			}, function(err) {
				console.log('adding page failed', err)
			})

	}

	function add_page_to_cmslist(context, path, new_pagename) {
		if(path.length == 1) {
			var newpage = angular.copy(context[path[0]][path[0]])
			newpage.name = format_service.deslug(new_pagename)
			newpage.fullpath = newpage.fullpath.split('/').slice(0,-1).join('/') + '/' + format_service.slug(new_pagename)
			context[path[0]][new_pagename] = newpage

			$location.path('cms/' + newpage.fullpath)


		} else {
			add_page_to_cmslist(context[path[0]], path.splice(1), new_pagename)
		}
	}

}])