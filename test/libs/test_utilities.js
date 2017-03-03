var test_utilities = function () {}

// vendor dependencies
var Promise = require('bluebird')
var path = require('path')
var request = require('request')
var fs = require('fs')

var local_enduro = require('../../index')
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')

test_utilities.prototype.request_file = function (url) {
	return new Promise(function (resolve, reject) {

		if (flat_helpers.is_local(url)) {
			fs.readFile(path.join(enduro.project_path, url), 'utf8', function (err, data) {
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
