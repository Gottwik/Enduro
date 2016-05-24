// * ———————————————————————————————————————————————————————— * //
// * 	Enduro admin upload handler
// * ———————————————————————————————————————————————————————— * //
var admin_file_upload_handler = function () {}

// vendor dependencies
var Promise = require('bluebird')
var fs = require('fs')

// local dependencies
var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')

// constants
var UPLOADS_FOLDER = '/assets/img/uploaded'

admin_file_upload_handler.prototype.upload = function(file) {
	return new Promise(function(resolve, reject){

		var destination_path = CMD_FOLDER + UPLOADS_FOLDER + '/' + file.name
		var destination_src_path = CMD_FOLDER + '/_src/' +UPLOADS_FOLDER + file.name
		var destination_url = UPLOADS_FOLDER + '/' + file.name

		enduro_helpers.ensureDirectoryExistence(destination_src_path)
			.then(() => {
				//fs.rename(file.path, destination_path, function(err) {
				console.log('copyying file', file.path, destination_path)

				var read_stream = fs.createReadStream(file.path)

				read_stream.pipe(fs.createWriteStream(destination_path))
				read_stream.pipe(fs.createWriteStream(destination_src_path))
					.on("close", function(err) {
						if(err) {
							console.log(err)
							return reject(err);
						}
						kiska_logger.timestamp('file was uploaded','file_uploading')
						resolve(destination_url)
					});
			})

	})
}


module.exports = new admin_file_upload_handler()