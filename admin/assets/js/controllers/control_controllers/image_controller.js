enduro_admin_app.controller('image_controller', ['$scope', 'Upload', 'url_config', '$cookies', function ($scope, Upload, url_config, $cookies) {

	$scope.progress = 100

	// upload on file select or drop
	$scope.upload = function (file) {

		$('.img-dropper').blur()
		// catch pasted image
		if(typeof file === 'object' && !file.name) {
			file = file[0]
			file.name = Math.random().toString(36).substring(7) + '.' + file.type.match(/\/(.*)$/)[1];
		}

		Upload.upload({
			url: url_config.get_base_url() + 'img_upload',
			data: {
				sid: $cookies.get('sid'),
				file: file
			}
		}).then(function (res) {
			if(res.data.success) {
				console.log('uploaded', res.data.image_url)
				$scope.context[$scope.terminatedkey] = res.data.image_url
			} else {
				console.log('upload not successfull')
			}
		}, function (res) {
			console.log('Error status: ' + res.status)
		}, function (evt) {
			var progress = parseInt(100.0 * evt.loaded / evt.total)
			$scope.progress = progress
			console.log(progress)
		});
	};

	$scope.delete_image = function() {
		$scope.context[$scope.terminatedkey] = ''
	}

}]);