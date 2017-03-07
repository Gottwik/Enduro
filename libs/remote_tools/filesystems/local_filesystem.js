// * ———————————————————————————————————————————————————————— * //
// * 	remote handler
// *	uploads files to s3
// * ———————————————————————————————————————————————————————— * //
var filesystem = function () {}

// vendor dependencies
var Promise = require('bluebird')
var path = require('path')
var fs = require('fs')

// local dependencies
var logger = require(enduro.enduro_path + '/libs/logger')
var remote_handler = require(enduro.enduro_path + '/libs/remote_tools/remote_handler')
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')

// constants
var UPLOADS_FOLDER = 'remote'

// basically copies the file
filesystem.prototype.upload = function (filename, path_to_file) {
	return new Promise(function (resolve, reject) {
		var destination_path = path.join(enduro.project_path, UPLOADS_FOLDER, filename)
		var destination_url = path.join(UPLOADS_FOLDER, filename)

		flat_helpers.ensure_directory_existence(destination_path)
			.then(() => {
				var read_stream = fs.createReadStream(path_to_file)

				read_stream.pipe(fs.createWriteStream(destination_path))
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


filesystem.prototype.get_remote_url = function (path_to_file) {
	return path.join(enduro.project_path, UPLOADS_FOLDER, path_to_file)
}

module.exports = new filesystem()
