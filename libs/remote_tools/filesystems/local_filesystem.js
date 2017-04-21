// * ———————————————————————————————————————————————————————— * //
// *	uploads files to local storage
// * ———————————————————————————————————————————————————————— * //
var filesystem = function () {}

// vendor dependencies
var Promise = require('bluebird')
var path = require('path')
var fs = require('fs')

// local dependencies
var logger = require(enduro.enduro_path + '/libs/logger')
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')

// constants
var UPLOADS_FOLDER = 'remote'

filesystem.prototype.init = function () {
	// no init required
}

// basically copies the file
filesystem.prototype.upload = function (filename, path_to_file) {
	return new Promise(function (resolve, reject) {
		var destination_path = path.join(enduro.project_path, UPLOADS_FOLDER, filename)
		var destination_src_path = path.join(enduro.project_path, enduro.config.build_folder, UPLOADS_FOLDER, filename)
		var destination_url = '/' + UPLOADS_FOLDER + '/' + filename

		flat_helpers.ensure_directory_existence(destination_path, destination_src_path)
			.then(() => {
				var read_stream = fs.createReadStream(path_to_file)

				read_stream.pipe(fs.createWriteStream(destination_src_path))
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
