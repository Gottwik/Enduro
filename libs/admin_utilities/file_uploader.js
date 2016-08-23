// * ———————————————————————————————————————————————————————— * //
// * 	Enduro admin upload handler
// * ———————————————————————————————————————————————————————— * //
var admin_file_upload_handler = function () {}

// vendor dependencies
var Promise = require('bluebird')
var fs = require('fs')
var path = require('path')

// local dependencies
var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')
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

function uploadfile_local (file) {
	kiska_logger.timestamp('Uploading file to local storage', 'file_uploading')
	return new Promise(function (resolve, reject) {
		var destination_path = CMD_FOLDER + UPLOADS_FOLDER + '/' + (new Date() / 1e3 | 0) + '_' + file.name
		var destination_src_path = path.join(CMD_FOLDER, '_src', UPLOADS_FOLDER, (new Date() / 1e3 | 0) + '_' + file.name)
		var destination_url = UPLOADS_FOLDER + '/' + (new Date() / 1e3 | 0) + '_' + file.name

		enduro_helpers.ensure_directory_existence(destination_path, destination_src_path)
			.then(() => {
				var read_stream = fs.createReadStream(file.path)

				read_stream.pipe(fs.createWriteStream(destination_path))
				read_stream.pipe(fs.createWriteStream(destination_src_path))
					.on('close', function (err) {
						if (err) {
							console.log(err)
							return reject(err)
						}
						kiska_logger.timestamp('file was uploaded ' + destination_url, 'file_uploading')
						resolve(destination_url)
					})
			})
	})
}

module.exports = new admin_file_upload_handler()
