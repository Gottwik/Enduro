
// vendor dependencies
var expect = require('chai').expect
var rimraf = require('rimraf')
var path = require('path')

// local dependencies
var local_enduro = require('../../index')
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')

describe('flat helpers', function () {

	before(() => {
		return local_enduro.init()
			.then(() => {
				enduro.actions.silent()
			})
	})

	it('should detect an existing file', function () {
		expect(flat_helpers.file_exists_sync(process.cwd() + '/index.js')).to.equal(true)
	})

	it('should detect an existing file in subfolder', function () {
		expect(flat_helpers.file_exists_sync(process.cwd() + '/libs/scaffolder.js')).to.equal(true)
	})

	it('should not detect an nonexisting file', function () {
		expect(flat_helpers.file_exists_sync(process.cwd() + '/crazyfile.js')).to.not.equal(true)
	})

	it('should not detect an nonexisting file in subfolder', function () {
		expect(flat_helpers.file_exists_sync(process.cwd() + '/libs/crazyfile.js')).to.not.equal(true)
	})

	it('should detect an existing folder', function () {
		expect(flat_helpers.dir_exists_sync(process.cwd() + '/libs')).to.equal(true)
	})

	it('should detect an existing nested folder', function () {
		expect(flat_helpers.dir_exists_sync(process.cwd() + '/scaffolding/minimalistic/assets')).to.equal(true)
	})

	it('should not detect an nonexisting folder', function () {
		expect(flat_helpers.dir_exists_sync(process.cwd() + '/asdf')).to.not.equal(true)
	})

	it('should create all neccessary subdirectories', function () {
		return flat_helpers.ensure_directory_existence(path.join(process.cwd(), 'test_folder', 'subfolder', 'test.js'))
			.then(function () {
				expect(flat_helpers.dir_exists_sync(path.join(process.cwd(), 'test_folder', 'subfolder'))).to.equal(true)
			}, function () {
				expect(true).to.equal(false)
			})
	})

	it('should create all neccessary subdirectories if given multiple paths', function () {
		return flat_helpers.ensure_directory_existence(
				path.join(process.cwd(), 'test_folder', 'subfolder1', 'test.js'),
				path.join(process.cwd(), 'test_folder', 'subfolder2', 'test.js')
			)
			.then(function () {
				expect(flat_helpers.dir_exists_sync(process.cwd() + '/test_folder/subfolder1')).to.equal(true)
				expect(flat_helpers.dir_exists_sync(process.cwd() + '/test_folder/subfolder2')).to.equal(true)
			}, function () {
				expect(true).to.equal(false)
			})
	})

	it('should delete all test folders', function () {
		rimraf(process.cwd() + '/test_folder', function () {
			expect(flat_helpers.dir_exists_sync(process.cwd() + '/test_folder')).to.equal(false)
		})
	})

})
