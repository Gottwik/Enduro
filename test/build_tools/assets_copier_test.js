// vendor dependencies
var expect = require('chai').expect
var path = require('path')

// local dependencies
var flat_helpers = require(ENDURO_FOLDER + '/libs/flat_db/flat_helpers')
var enduro = require(ENDURO_FOLDER + '/index')

describe('Static assets copier', function () {

	// Create a new project
	before(function (done) {
		var test_project_name = 'asset_copier_testfolder'

		enduro.run(['create', test_project_name])
			.then(() => {
				// navigate inside new project
				global.CMD_FOLDER = path.join(CMD_FOLDER, test_project_name)
				enduro.run(['start'])
					.then(() => {
						done()
					})
			}, () => {
				done(new Error('Failed to create new project'))
			})
	})

	it('should have copied all images files', function () {
		expect(flat_helpers.file_exists_sync(path.join(CMD_FOLDER, '_src', 'assets', 'img', 'imagesgohere.txt'))).to.be.ok
	})

	it('should have copied all fonts files', function () {
		expect(flat_helpers.file_exists_sync(path.join(CMD_FOLDER, '_src', 'assets', 'fonts', 'fontsgohere.txt'))).to.be.ok
	})

	it('should have copied all javascript files', function () {
		expect(flat_helpers.file_exists_sync(path.join(CMD_FOLDER, '_src', 'assets', 'js', 'main.js'))).to.be.ok
	})

	it('should have copied all admin_extensions files', function () {
		expect(flat_helpers.file_exists_sync(path.join(CMD_FOLDER, '_src', 'assets', 'admin_extensions', 'sample_extension.js'))).to.be.ok
	})

	// navigate back to testfolder
	after(function (done) {
		enduro.server_stop(() => {
			global.CMD_FOLDER = process.cwd() + '/testfolder'
			done()
		})
	})
})

