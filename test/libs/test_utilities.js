var test_utilities = function () {}

// vendor dependencies
var Promise = require('bluebird')
var path = require('path')
var request = require('request')
var fs = require('fs')
var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')

test_utilities.prototype.request_file = function (url) {
	return new Promise(function (resolve, reject) {

		if (enduro_helpers.is_local(url)) {
			fs.readFile(path.join(CMD_FOLDER, url), 'utf8', function (err, data) {
				if (err) {
					reject('file was not uploaded locally')
				}

				resolve(data)
			})
		} else {
			request(url, function (err, response, body) {

				if (err) {
					reject('file was not uploaded to s3')
				}

				resolve(body)
			})
		}

	})
}

module.exports = new test_utilities()
