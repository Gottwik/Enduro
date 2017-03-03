// vendor dependencies
var expect = require('chai').expect
var path = require('path')

// local dependencies
var local_enduro = require('../../index')
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
var test_utilities = require(enduro.enduro_path + '/test/libs/test_utilities')

describe('Sass build tool', function () {

	// Create a new project
	before(function (done) {
		var test_project_name = 'spritesheet_generation_testfolder'

		local_enduro.run(['create', test_project_name, 'test'])
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

	it('should create css file for every scss file in root assets/css folder', function () {
		expect(flat_helpers.file_exists_sync(path.join(enduro.project_path, '_src', '_prebuilt', 'sprites.scss'))).to.be.ok
		expect(flat_helpers.file_exists_sync(path.join(enduro.project_path, '_src', 'assets', 'spriteicons', 'spritesheet.png'))).to.be.ok
		expect(flat_helpers.file_exists_sync(path.join(enduro.project_path, '_src', 'assets', 'spriteicons', 'spritesheet@2x.png'))).to.be.ok
	})

	// navigate back to testfolder
	after(function (done) {
		local_enduro.server_stop(() => {
			enduro.project_path  = process.cwd() + '/testfolder'
			done()
		})
	})
})

