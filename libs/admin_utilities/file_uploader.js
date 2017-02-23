// * ———————————————————————————————————————————————————————— * //
// * 	Enduro admin upload handler
// * ———————————————————————————————————————————————————————— * //
var admin_file_upload_handler = function () {}

// vendor dependencies
var Promise = require('bluebird')
var fs = require('fs')
var path = require('path')
var http = require('http')

// local dependencies
var flat_helpers = require(ENDURO_FOLDER + '/libs/flat_db/flat_helpers')
var logger = require(ENDURO_FOLDER + '/libs/logger')
var remote_handler = require(ENDURO_FOLDER + '/libs/remote_tools/remote_handler')

// constants
var UPLOADS_FOLDER = '/assets/img/uploaded'

admin_file_upload_handler.prototype.upload = function (file) {
	// decides where to upload files
	if (global.config.variables.S3_KEY && global.config.variables.S3_SECRET) {
		return remote_handler.upload_to_s3_by_file(file, true)
	} else {
		return uploadfile_local(file)
	}
}

admin_file_upload_handler.prototype.upload_by_url = function (file_url) {
	var self = this

	return new Promise(function (resolve, reject) {

		var filename = flat_helpers.get_filename_from_url(file_url)

		if (flat_helpers.is_local(file_url)) {
			self.upload_from_local(filename, file_url)
				.then(() => {
					resolve()
				})
		} else {
			var destination = path.join(CMD_FOLDER, 't', filename)
			flat_helpers.ensure_directory_existence(destination)
				.then(() => {
					var file = fs.createWriteStream(destination)
					http.get(file_url, function (response) {
						response.pipe(file)
						file.on('finish', () => {
							file.close(() => {
								self.upload_from_local(filename, destination)
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

admin_file_upload_handler.prototype.upload_from_local = function (filename, file_location) {
	var self = this

	var mock_file = {
		name: filename,
		path: file_location
	}
	return self.upload(mock_file)
}

function uploadfile_local (file) {
	logger.timestamp('Uploading file to local storage', 'file_uploading')
	return new Promise(function (resolve, reject) {
		var destination_path = path.join(CMD_FOLDER, UPLOADS_FOLDER, (new Date() / 1e3 | 0) + '_' + file.name)
		var destination_src_path = path.join(CMD_FOLDER, '_src', UPLOADS_FOLDER, (new Date() / 1e3 | 0) + '_' + file.name)
		var destination_url = UPLOADS_FOLDER + '/' + (new Date() / 1e3 | 0) + '_' + file.name

		flat_helpers.ensure_directory_existence(destination_path, destination_src_path)
			.then(() => {
				var read_stream = fs.createReadStream(file.path)

				read_stream.pipe(fs.createWriteStream(destination_path))
				read_stream.pipe(fs.createWriteStream(destination_src_path))
					.on('close', function (err) {
						if (err) {
							return reject(err)
						}
						logger.timestamp('file was uploaded ' + destination_url, 'file_uploading')
						resolve(destination_url)
					})
			})
	})
}

module.exports = new admin_file_upload_handler()
