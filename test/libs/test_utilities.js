var test_utilities = function () {}

// vendor dependencies
var Promise = require('bluebird')
var path = require('path')
var request = require('request')
var fs = require('fs')
var rimraf = require('rimraf')

// local dependencies
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')

test_utilities.prototype.before = function (local_enduro, project_name) {
	return local_enduro.init()
		.then(() => {
			enduro.actions.silent()
			enduro.project_path = path.join(enduro.project_path, 'testfolder')
			return flat_helpers.ensure_directory_existence(path.join(enduro.project_path, 'a'))
		})
		.then(() => {
			return enduro.actions.create(project_name, 'test')
		})
		.then(() => {
			enduro.project_path = path.join(enduro.project_path, project_name)
		})
}

test_utilities.prototype.after = function () {
	return new Promise(function (resolve, reject) {
		if (path.basename(enduro.project_path).toLowerCase() != 'enduro') {
			rimraf(enduro.project_path, function () {
				enduro.project_path = path.join(process.cwd())
				resolve()
			})
		} else {
			resolve()
		}
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
