const test_utilities = function () {}

// * vendor dependencies
const Promise = require('bluebird')
const path = require('path')
const request = require('request-promise')
const fs = require('fs')

// * enduro dependencies
const flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
const remote_handler = require(enduro.enduro_path + '/libs/remote_tools/remote_handler')

// constants
const TEST_FOLDER_PATH = path.join(process.cwd(), 'testfolder')

test_utilities.prototype.before = function (local_enduro, project_name, scaffolding) {
	const self = this

	scaffolding = scaffolding || 'test'

	return self.delete_testfolder()
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
			return local_enduro.init({ project_path: enduro.project_path })
		})
}

test_utilities.prototype.after = function () {
	const self = this

	// this will delete testfolder and set the path back to project's root for the other tests
	return Promise.race([
			self.delete_testfolder()
				.then(() => {
					enduro.project_path = process.cwd()
				}),
			new Promise.delay(1500)
		])
}

test_utilities.prototype.request_file = function (url) {
	if (flat_helpers.is_local(url)) {
		url = path.join(enduro.project_path, url)
	}
	return remote_handler.request_file(url)
		.catch((error) => {
			return new Promise.reject(error)
		})
		.spread((file_contents, response) => {
			return file_contents
		})
}

test_utilities.prototype.delete_testfolder = function () {
	return flat_helpers.delete_folder(TEST_FOLDER_PATH)
}

test_utilities.prototype.get_sid = function () {
	return request({
		url: 'http://localhost:5000/admin_api/login_by_password',
		qs: { username: 'gottwik', password: '123' }
	})
		.then((body) => {
			const res = JSON.parse(body)
			if (res && res.success) {
				return res.sid
			} else {
				return null
			}
		})
}

module.exports = new test_utilities()
