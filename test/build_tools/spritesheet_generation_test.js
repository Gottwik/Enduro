// vendor dependencies
var expect = require('chai').expect
var path = require('path')

// local dependencies
var local_enduro = require('../../index').quick_init()
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
var test_utilities = require(enduro.enduro_path + '/test/libs/test_utilities')

describe('Spritesheet build tool', function () {

	before(function () {
		return test_utilities.before(local_enduro, 'spritesheet_generation_testfolder')
			.then(() => {
				return enduro.actions.render()
			})
	})

	it('should create css file for every scss file in root assets/css folder', function () {
		expect(flat_helpers.file_exists_sync(path.join(enduro.project_path, enduro.config.build_folder, '_prebuilt', 'sprites.scss'))).to.be.ok
		expect(flat_helpers.file_exists_sync(path.join(enduro.project_path, enduro.config.build_folder, 'assets', 'spriteicons', 'spritesheet.png'))).to.be.ok
		expect(flat_helpers.file_exists_sync(path.join(enduro.project_path, enduro.config.build_folder, 'assets', 'spriteicons', 'spritesheet@2x.png'))).to.be.ok
	})

	after(function () {
		return test_utilities.after()
	})
})

