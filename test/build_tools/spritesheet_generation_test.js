// vendor dependencies
var expect = require('chai').expect
var path = require('path')

// local dependencies
var flat_helpers = require(ENDURO_FOLDER + '/libs/flat_db/flat_helpers')
var test_utilities = require(ENDURO_FOLDER + '/test/libs/test_utilities')
var enduro = require(ENDURO_FOLDER + '/index')

describe('Sass build tool', function () {

	// Create a new project
	before(function (done) {
		var test_project_name = 'spritesheet_generation_testfolder'

		enduro.run(['create', test_project_name, 'test'])
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

	it('should create css file for every scss file in root assets/css folder', function () {
		expect(flat_helpers.file_exists_sync(path.join(CMD_FOLDER, '_src', '_prebuilt', 'sprites.scss'))).to.be.ok
		expect(flat_helpers.file_exists_sync(path.join(CMD_FOLDER, '_src', 'assets', 'spriteicons', 'spritesheet.png'))).to.be.ok
		expect(flat_helpers.file_exists_sync(path.join(CMD_FOLDER, '_src', 'assets', 'spriteicons', 'spritesheet@2x.png'))).to.be.ok
	})

	// navigate back to testfolder
	after(function (done) {
		enduro.server_stop(() => {
			global.CMD_FOLDER = process.cwd() + '/testfolder'
			done()
		})
	})
})

