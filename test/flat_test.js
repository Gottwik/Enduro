var expect = require("chai").expect
var fs = require('fs')
var enduro_helpers = require('../libs/flat_utilities/enduro_helpers')
var rimraf = require('rimraf')

describe('Enduro flat file utilities', function() {

	it('should detect an existing file', function () {
		expect(enduro_helpers.fileExists(cmd_folder + '/index.js')).to.equal(true)
	})

	it('should detect an existing file in subfolder', function () {
		expect(enduro_helpers.fileExists(cmd_folder + '/libs/scaffolder.js')).to.equal(true)
	})

	it('should not detect an nonexisting file', function () {
		expect(enduro_helpers.fileExists(cmd_folder + '/crazyfile.js')).to.not.equal(true)
	})

	it('should not detect an nonexisting file in subfolder', function () {
		expect(enduro_helpers.fileExists(cmd_folder + '/libs/crazyfile.js')).to.not.equal(true)
	})

	it('should detect an existing folder', function () {
		expect(enduro_helpers.dirExists(cmd_folder + '/libs')).to.equal(true)
	})

	it('should detect an existing nested folder', function () {
		expect(enduro_helpers.dirExists(cmd_folder + '/scaffolding/api')).to.equal(true)
	})

	it('should not detect an nonexisting folder', function () {
		expect(enduro_helpers.dirExists(cmd_folder + '/asdf')).to.not.equal(true)
	})

	it('should create all neccessary subdirectories', function () {
		enduro_helpers.ensureDirectoryExistence(cmd_folder + '/test_folder/subfolder/test.js')
			.then(function(){
				expect(enduro_helpers.dirExists(cmd_folder + '/test_folder/subfolder')).to.equal(true)
			}, function(err){
				expect(true).to.equal(false)
			})
	})

	it('should delete all test folders', function () {
		rimraf(cmd_folder + '/test_folder', function(err){
			expect(enduro_helpers.dirExists(cmd_folder + '/test_folder')).to.not.equal(true)
		})
	})

})