var expect = require("chai").expect
var fs = require('fs')
var rimraf = require('rimraf')

var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')
var flat_file_handler = require(ENDURO_FOLDER+'/libs/flat_utilities/flat_file_handler')
var enduro = require(ENDURO_FOLDER + '/index')


describe('Enduro helpers utilities', function() {

	it('should detect an existing file', function () {
		expect(enduro_helpers.fileExists(process.cwd() + '/index.js')).to.equal(true)
	})

	it('should detect an existing file in subfolder', function () {
		expect(enduro_helpers.fileExists(process.cwd() + '/libs/scaffolder.js')).to.equal(true)
	})

	it('should not detect an nonexisting file', function () {
		expect(enduro_helpers.fileExists(process.cwd() + '/crazyfile.js')).to.not.equal(true)
	})

	it('should not detect an nonexisting file in subfolder', function () {
		expect(enduro_helpers.fileExists(process.cwd() + '/libs/crazyfile.js')).to.not.equal(true)
	})

	it('should detect an existing folder', function () {
		expect(enduro_helpers.dirExists(process.cwd() + '/libs')).to.equal(true)
	})

	it('should detect an existing nested folder', function () {
		expect(enduro_helpers.dirExists(process.cwd() + '/scaffolding/api')).to.equal(true)
	})

	it('should not detect an nonexisting folder', function () {
		expect(enduro_helpers.dirExists(process.cwd() + '/asdf')).to.not.equal(true)
	})

	it('should create all neccessary subdirectories', function () {
		enduro_helpers.ensureDirectoryExistence(process.cwd() + '/test_folder/subfolder/test.js')
			.then(function(){
				expect(enduro_helpers.dirExists(process.cwd() + '/test_folder/subfolder')).to.equal(true)
			}, function(err){
				expect(true).to.equal(false)
			})
	})

	it('should delete all test folders', function () {
		rimraf(process.cwd() + '/test_folder', function(err){
			expect(enduro_helpers.dirExists(process.cwd() + '/test_folder')).to.not.equal(true)
		})
	})

})

describe('Enduro flat utilities', function() {

	var prev_test_folder

	before(function(done) {
		prev_test_folder = CMD_FOLDER
		enduro.run(['create', 'testfolder_flat_test'])
			.then(() => {
				CMD_FOLDER += '/testfolder_flat_test'
				done()
			}, (err) => {
				done(new Error(err))
			})
	});

	it('should detect an existing flat file', function () {
		expect(enduro_helpers.fileExists(CMD_FOLDER + '/cms/index.js')).to.equal(true)
	})

	after((done) => {
		CMD_FOLDER = prev_test_folder
		done()
	})
})