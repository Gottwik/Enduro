// vendor dependencies
var expect = require('chai').expect
var path = require('path')

// local dependencies
var local_enduro = require('../../index').quick_init()
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
var test_utilities = require(enduro.enduro_path + '/test/libs/test_utilities')

describe('Sass build tool', function () {

	before(function () {
		return test_utilities.before(local_enduro, 'sass_testfolder')
			.then(() => {
				return enduro.actions.render()
			})
	})

	it('should create css file for every scss file in root assets/css folder', function () {
		expect(flat_helpers.file_exists_sync(path.join(enduro.project_path, enduro.config.build_folder, 'assets', 'css', 'test.css'))).to.be.ok
	})

	it('should compile simple scss file', function () {
		return test_utilities.request_file(path.join(enduro.config.build_folder, 'assets', 'css', 'test.css'))
			.then((file_contents) => {
				expect(file_contents).to.contain('p {')
					.and.to.contain('color: #f00;')
			})
	})

	after(function () {
		return test_utilities.after()
	})
})

