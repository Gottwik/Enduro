// * vendor dependencies
const expect = require('chai').expect
const path = require('path')

// * enduro dependencies
const local_enduro = require('../../index').quick_init()
const flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
const test_utilities = require(enduro.enduro_path + '/test/libs/test_utilities')

describe('Stylus build tool', function () {

	before(function () {
		this.timeout(5000);
		return test_utilities.before(local_enduro, 'stylus_testfolder', 'test_stylus')
			.then(() => {
				return enduro.actions.render()
			})
	})

	it('should create css file for every styl file in root assets/css folder', function () {
		expect(flat_helpers.file_exists_sync(path.join(enduro.project_path, enduro.config.build_folder, 'assets', 'css', 'test.css'))).to.be.ok
	})

	it('should compile simple stylus file', function () {
		return test_utilities.request_file(path.join(enduro.config.build_folder, 'assets', 'css', 'test.css'))
			.then((file_contents) => {
				expect(file_contents).to.contain('p {')
					.and.to.contain('color: #e00;')
			})
	})

	it('should use autoprefixer', function () {
		return test_utilities.request_file(path.join(enduro.config.build_folder, 'assets', 'css', 'test.css'))
			.then((file_contents) => {

				expect(file_contents).to.contain('display: -ms-flexbox;')
					.and.to.contain('display: -webkit-box;')
			})
	})

	after(function () {
		return test_utilities.after()
	})
})

