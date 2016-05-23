// * ———————————————————————————————————————————————————————— * //
// * 	Enduro admin upload handler
// * ———————————————————————————————————————————————————————— * //
var admin_file_upload_handler = function () {}

// vendor dependencies
var Promise = require('bluebird')
var fs = require('fs')

// local dependencies
var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')

// constants
var UPLOADS_FOLDER = '/assets/img/uploaded'

admin_file_upload_handler.prototype.upload = function(file) {
	return new Promise(function(resolve, reject){

		var destination_path = CMD_FOLDER + UPLOADS_FOLDER + '/' + file.name
		var destination_url = UPLOADS_FOLDER + '/' + file.name

		enduro_helpers.ensureDirectoryExistence(destination_path)
			.then(() => {
				fs.rename(file.path, destination_path, function(err) {
				    if(err) {
				    	console.log(err)
				        return reject(err);
				    }

					resolve(destination_url)
				});
			})

	})
}


module.exports = new admin_file_upload_handler()