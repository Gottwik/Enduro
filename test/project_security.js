var expect = require("chai").expect
var enduro = require('../index')
var rimraf = require('rimraf')
var fs = require('fs')
var enduro_helpers = require('../libs/flat_utilities/enduro_helpers')
var kiska_guard = require('../libs/kiska_guard')


describe('Enduro security', function() {

	//Create a new project
	before(function(done){
		enduro.run(['create', 'testproject_security'])
			.then(() => {
				// navigate inside new project
				global.cmd_folder = cmd_folder + '/testproject_security'
				done()
			}, () => {
				done(new Error("Failed to create new project"))
			})
	});

	// navigage back to testfolder
	after(function(){
		global.cmd_folder = process.cwd() + '/testfolder'
	})

	it("won't do nothing if no passphrase is provided", function(done){
		enduro.run(['secure'])
			.then(() => {
				done(new Error("Failed to detect missing passphrase"))
			}, () => {
				done()
			})
	})

	it("should create a passphrase file when enduro is secured", function(done){
		enduro.run(['secure', 'testphrase'])
			.then(() => {
				done()
			}, () => {
				done(new Error("Failed to detect missing passphrase"))
			})
	})

	it("should make sure the passphrase file is created", function(){
		expect(enduro_helpers.fileExists(cmd_folder + '/.enduro_secure')).to.equal(true)
	})

	it("should verify the correct passphrase", function(done){
		kiska_guard.verify_passphrase('testphrase')
			.then(() => {
				done()
			}, () => {
				done(new Error("Failed to verify the correct passphrase"))
			})
	})

	it("should fail to verify the incorrect passphrase", function(done){
		kiska_guard.verify_passphrase('notcorrectpassphrase')
			.then(() => {
				done(new Error("Failed to not verify the incorrect passphrase"))
			}, () => {
				done()
			})
	})

	it("should fail to verify the empty passphrase", function(done){
		kiska_guard.verify_passphrase()
			.then(() => {
				done(new Error("Failed to not verify the incorrect passphrase"))
			}, () => {
				done()
			})
	})

})