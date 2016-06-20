enduro_admin_app.controller('image_controller', ['$scope', 'Upload', 'url_config', '$cookies', function ($scope, Upload, url_config, $cookies) {

	// upload on file select or drop
	$scope.upload = function (file) {
		Upload.upload({
			url: url_config.get_base_url() + 'img_upload',
			data: {
				'sid': $cookies.get('sid'),
				file: file
			}
		}).then(function (res) {
			if(res.data.success) {
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
	// // for multiple files:
	// $scope.uploadFiles = function (files) {
	//   if (files && files.length) {
	//     for (var i = 0; i < files.length; i++) {
	//       Upload.upload({..., data: {file: files[i]}, ...})...;
	//     }
	//     // or send them all together for HTML5 browsers:
	//     Upload.upload({..., data: {file: files}, ...})...;
	//   }
	// }
}]);