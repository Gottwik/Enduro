
// vendor dependencies
var expect = require('chai').expect
var rimraf = require('rimraf')
var path = require('path')

// local dependencies
var flat_helpers = require(ENDURO_FOLDER + '/libs/flat_db/flat_helpers')
var flat = require(ENDURO_FOLDER + '/libs/flat_db/flat')
var enduro = require(ENDURO_FOLDER + '/index')

enduro.silent()

describe('Enduro helpers utilities', function () {

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
			expect(flat_helpers.dir_exists_sync(process.cwd() + '/test_folder')).to.not.equal(true)
		})
	})

})

describe('Enduro flat utilities', function () {

	before(function (done) {
		enduro.run(['create', 'testfolder_flat_test'])
			.then(() => {
				CMD_FOLDER = process.cwd() + '/testfolder/testfolder_flat_test'
				done()
			}, (err) => {
				done(new Error(err))
			})
	})

	it('should detect an existing flat file', function () {
		expect(flat.file_exists('index')).to.equal(true)
	})

	var full_index_file
	it('should convert relative path into full path', function () {
		full_index_file = flat.get_full_path_to_cms('index')
		expect(flat_helpers.file_exists_sync(full_index_file)).to.equal(true)
	})

	it('should convert absolute path into relative', function () {
		expect(flat.get_cms_filename_from_fullpath(full_index_file)).to.equal('index')
	})

	it('should not detect an nonexisting flat file', function () {
		expect(flat.file_exists('aegwa')).to.equal(false)
	})

	// navigate back to testfolder
	after(function () {
		global.CMD_FOLDER = process.cwd() + '/testfolder'
	})
})
