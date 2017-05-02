// * ———————————————————————————————————————————————————————— * //
// * 	remote handler
// *	uploads files to filesystem
// * ———————————————————————————————————————————————————————— * //
var remote_handler = function () {}

// vendor dependencies
var Promise = require('bluebird')
var request = require('request')

// local dependencies
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
var fs = require('fs')

remote_handler.prototype.upload_to_filesystem_by_file = function (file, timestamp) {

	// apply timestamp to file's name if it is requested by timestamp parameter
	var filename = timestamp ? timestamp_filename(file.name) : file.name
	// normalize filename (ascii only, no whitespace)
	filename = filename.replace(/[^\x00-\x7F]|\ /ig, '')
	return enduro.filesystem.upload('direct_uploads/' + filename, file.path)
}

remote_handler.prototype.upload_to_filesystem_by_filepath = function (filename, path_to_file) {
	return enduro.filesystem.upload(filename, path_to_file)
}

remote_handler.prototype.get_remote_url = function (filename, juicebox) {
	return enduro.filesystem.get_remote_url(filename, juicebox)
}

remote_handler.prototype.request_file = function (url) {
	return new Promise(function (resolve, reject) {
		if (flat_helpers.is_local(url)) {
			fs.readFile(url, 'utf8', function (err, data) {
				if (err) {
					return reject()
				}
				resolve([data, { statusCode: 200 }])
			})
		} else {
			request(url, function (err, response, body) {

				if (err) {
					return reject()
				}
				resolve([body, response])
			})
		}

	})
}

remote_handler.prototype.request_stream = function (url) {
	if (flat_helpers.is_local(url)) {
		return fs.createReadStream(url)
	} else {
		return request(url)
	}
}

function timestamp_filename (filename) {
	return (new Date() / 1e3 | 0) + '_' + filename
}

module.exports = new remote_handler()
