// * vendor dependencies
const expect = require('chai').expect
const path = require('path')

// * enduro dependencies
const local_enduro = require('../../index').quick_init()
const flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
const test_utilities = require(enduro.enduro_path + '/test/libs/test_utilities')

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

