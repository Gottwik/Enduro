
// vendor dependencies
var expect = require("chai").expect
var rimraf = require('rimraf')
var fs = require('fs')

// local dependencies
var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')
var enduro = require(ENDURO_FOLDER + '/index')

// Remove logging
enduro.silent()

describe('Enduro project creation', function() {

	it('should do nothing if malformed arguments are provided', function (done) {
		enduro.run(['someweirdargument'])
			.then(() => {
				done(new Error("Failes to detect malformed argument"))
			}, () => {
				done()
			})
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
		expect(enduro_helpers.dirExists(CMD_FOLDER + '/testproject_creation')).to.equal(true)
	});

	it("the project folder should have all the subfolders", function(){
		expect(enduro_helpers.dirExists(CMD_FOLDER + '/testproject_creation/pages')).to.equal(true)
		expect(enduro_helpers.dirExists(CMD_FOLDER + '/testproject_creation/app')).to.equal(true)
		expect(enduro_helpers.dirExists(CMD_FOLDER + '/testproject_creation/assets')).to.equal(true)
		expect(enduro_helpers.dirExists(CMD_FOLDER + '/testproject_creation/cms')).to.equal(true)
		expect(enduro_helpers.dirExists(CMD_FOLDER + '/testproject_creation/components')).to.equal(true)
	});

	it("the project folder should contain files", function(){
		expect(enduro_helpers.fileExists(CMD_FOLDER + '/testproject_creation/package.json')).to.equal(true)
		expect(enduro_helpers.fileExists(CMD_FOLDER + '/testproject_creation/cms/index.js')).to.equal(true)
	});
});