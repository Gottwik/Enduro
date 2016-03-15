var expect = require("chai").expect
var enduro = require('../index')
var rimraf = require('rimraf')
var fs = require('fs')
var enduro_helpers = require('../libs/flat_utilities/enduro_helpers')


describe('Enduro security', function() {

	//Create a new project
	beforeEach(function(done) {
		enduro.run(['create', 'testproject_security'])
			.then(() => {
				// navigate inside new project
				//global.cmd_folder = process.cwd() + '/testproject'
				done()
			}, () => {
				done(new Error("Failed to create new project"))
			})
	});

	// delete the project
	afterEach(function(done) {
		rimraf(cmd_folder + '/testproject_security', function(err){
			done()
		})
	});

	it("Won't do nothing if no passphrase is provided", function(done){
		enduro.run(['secure'])
			.then(() => {
				done(new Error("Failed to detect missing passphrase"))
			}, () => {
				done()
			})
	})

})