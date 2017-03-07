// * ———————————————————————————————————————————————————————— * //
// * 	Enduro admin upload handler
// * ———————————————————————————————————————————————————————— * //
var file_uploader = function () {}

// vendor dependencies
var Promise = require('bluebird')
var fs = require('fs')
var path = require('path')
var http = require('http')

// local dependencies
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
var logger = require(enduro.enduro_path + '/libs/logger')
var remote_handler = require(enduro.enduro_path + '/libs/remote_tools/remote_handler')

file_uploader.prototype.upload = function (file) {
	return remote_handler.upload_to_filesystem_by_file(file, true)
}

file_uploader.prototype.upload_by_url = function (file_url) {
	var self = this
	return new Promise(function (resolve, reject) {

		var filename = flat_helpers.get_filename_from_url(file_url)

		if (flat_helpers.is_local(file_url)) {
			self.upload_from_local(filename, file_url)
				.then(() => {
					resolve()
				})
		} else {
			var temp_download_destination = path.join(enduro.project_path, 't', filename)
			flat_helpers.ensure_directory_existence(temp_download_destination)
				.then(() => {
					var file = fs.createWriteStream(temp_download_destination)
					http.get(file_url, function (response) {
						response.pipe(file)
						file.on('finish', () => {
							file.close(() => {
								self.upload_from_local(filename, temp_download_destination)
									.then((destination_url) => {
										resolve(destination_url)
									})
							})
						})

					})
				})
		}
	})
}

file_uploader.prototype.upload_from_local = function (filename, file_location) {
	var self = this

	var mock_file = {
		name: filename,
		path: file_location
	}
	return self.upload(mock_file)
}

module.exports = new file_uploader()
