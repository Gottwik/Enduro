var test_utilities = function () {}

// vendor dependencies
var Promise = require('bluebird')
var path = require('path')
var request = require('request')
var fs = require('fs')

// local dependencies
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')

// constants
var TEST_FOLDER_PATH = path.join(process.cwd(), 'testfolder')

test_utilities.prototype.before = function (local_enduro, project_name, scaffolding) {

	scaffolding = scaffolding || 'test'

	return flat_helpers.delete_folder(TEST_FOLDER_PATH)
		.then(() => {
			return local_enduro.init()
		})
		.then(() => {
			enduro.actions.silent()
			enduro.project_path = path.join(enduro.project_path, 'testfolder')
			return flat_helpers.ensure_directory_existence(path.join(enduro.project_path, 'a'))
		})
		.then(() => {
			return enduro.actions.create(project_name, scaffolding)
		})
		.then(() => {
			enduro.project_path = path.join(enduro.project_path, project_name)
		})
}

test_utilities.prototype.after = function () {
	return flat_helpers.delete_folder(TEST_FOLDER_PATH)
		.then(() => {
			enduro.project_path = process.cwd()
		})
}


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
