// vendor dependencies
var expect = require('chai').expect
var path = require('path')

// local dependencies
var local_enduro = require('../../index')
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')

describe('Static assets copier', function () {

	// Create a new project
	before(function (done) {
		var test_project_name = 'asset_copier_testfolder'

		local_enduro.run(['create', test_project_name])
			.then(() => {
				// navigate inside new project
				enduro.project_path  = path.join(enduro.project_path, test_project_name)
				local_enduro.run(['start'])
					.then(() => {
						done()
					})
			}, () => {
				done(new Error('Failed to create new project'))
			})
	})

	it('should have copied all images files', function () {
		expect(flat_helpers.file_exists_sync(path.join(enduro.project_path, '_src', 'assets', 'img', 'imagesgohere.txt'))).to.be.ok
	})

	it('should have copied all fonts files', function () {
		expect(flat_helpers.file_exists_sync(path.join(enduro.project_path, '_src', 'assets', 'fonts', 'fontsgohere.txt'))).to.be.ok
	})

	it('should have copied all javascript files', function () {
		expect(flat_helpers.file_exists_sync(path.join(enduro.project_path, '_src', 'assets', 'js', 'main.js'))).to.be.ok
	})

	it('should have copied all admin_extensions files', function () {
		expect(flat_helpers.file_exists_sync(path.join(enduro.project_path, '_src', 'assets', 'admin_extensions', 'sample_extension.js'))).to.be.ok
	})

	// navigate back to testfolder
	after(function (done) {
		enduro.actions.stop_server(() => {
			enduro.project_path  = process.cwd() + '/testfolder'
			done()
		})
	})
})

