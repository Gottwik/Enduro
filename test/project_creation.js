var expect = require("chai").expect
var enduro = require('../index')
var rimraf = require('rimraf')
var fs = require('fs')
var enduro_helpers = require('../libs/flat_utilities/enduro_helpers')

// Remove logging
enduro.silent()

describe('Enduro project creation', function() {

	this.timeout(4000);

	it('should do nothing if malformed arguments are provided', function () {
		expect(enduro.run(['someweirdargument'])).equals(false)
	});

	it("should not create new project if no project name is provided", function(done){
		enduro.run(['create'])
			.then(() => {
				done(new Error("Failed to detect missing arguments"))
			}, () => {
				done()
			})
	});

	it("should be able to create a new project", function(done){
		enduro.run(['create', 'testproject_creation'])
			.then(() => {
				done()
			}, (err) => {
				done(new Error(err))
			})
	});

	it("should not create another project with the same name", function(done){
		enduro.run(['create', 'testproject_creation'])
			.then(() => {
				done(new Error("Failed to detect a project with the same name"))
			}, () => {
				done()
			})
	});


	it("the folder should exists", function(){
		expect(enduro_helpers.dirExists(cmd_folder + '/testproject_creation')).to.equal(true)
	});

	it("the project folder should have all the subfolders", function(){
		expect(enduro_helpers.dirExists(cmd_folder + '/testproject_creation/pages')).to.equal(true)
		expect(enduro_helpers.dirExists(cmd_folder + '/testproject_creation/api')).to.equal(true)
		expect(enduro_helpers.dirExists(cmd_folder + '/testproject_creation/assets')).to.equal(true)
		expect(enduro_helpers.dirExists(cmd_folder + '/testproject_creation/cms')).to.equal(true)
		expect(enduro_helpers.dirExists(cmd_folder + '/testproject_creation/components')).to.equal(true)
	});

	it("the project folder should contain files", function(){
		expect(enduro_helpers.fileExists(cmd_folder + '/testproject_creation/package.json')).to.equal(true)
		expect(enduro_helpers.fileExists(cmd_folder + '/testproject_creation/cms/index.js')).to.equal(true)
	});


	it("Should delete the project", function(done){
		rimraf(cmd_folder + '/testproject_creation', function(err){
			done()
		})
	});

	it("should make sure the test project folder is deleted", function(){
		expect(enduro_helpers.dirExists(cmd_folder + '/testproject_creation')).to.equal(false)
	});
});