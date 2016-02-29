var expect = require("chai").expect
var fs = require('fs')
var enduro_helpers = require('../libs/flat_utilities/enduro_helpers')


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

})