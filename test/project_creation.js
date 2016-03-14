var expect = require("chai").expect
var enduro = require('../index')
var rimraf = require('rimraf')
var fs = require('fs')
var enduro_helpers = require('../libs/flat_utilities/enduro_helpers')

// Remove logging
enduro.silent()

describe('Enduro project creation', function() {
	describe('General cli interface', function () {

		it('should do nothing if malformed arguments are provided', function () {
			expect(enduro.run(['someweirdargument'])).equals(false)
		});
	});

	describe('Creating new project', function () {
		this.timeout(4000);

		it("Not create new project if no project name is provided", function(){
			expect(enduro.run(['create'])).equals(false)
		});

		it("Should be able to create new project", function(done){
			enduro.run(['create', 'testproject'])
				.then(() => {
					done()
				}, () => {
					done(new Error("Failed to create new project"))
				})
		});

		it("Won't create another project with the same name", function(done){
			enduro.run(['create', 'testproject'])
				.then(() => {
					done(new Error("Failed to detect a project with the same name"))
				}, () => {
					done()
				})
		});

		it("After creating new project, the folder should exists", function(){
			expect(enduro_helpers.dirExists(cmd_folder + '/testproject')).to.equal(true)
		});

		it("After creating new project, the project folder should have all the subfolders", function(){
			expect(enduro_helpers.dirExists(cmd_folder + '/testproject/pages')).to.equal(true)
			expect(enduro_helpers.dirExists(cmd_folder + '/testproject/api')).to.equal(true)
			expect(enduro_helpers.dirExists(cmd_folder + '/testproject/assets')).to.equal(true)
			expect(enduro_helpers.dirExists(cmd_folder + '/testproject/cms')).to.equal(true)
			expect(enduro_helpers.dirExists(cmd_folder + '/testproject/components')).to.equal(true)
		});

		it("After creating new project, the project folder should contain files", function(){
			expect(enduro_helpers.fileExists(cmd_folder + '/testproject/package.json')).to.equal(true)
			expect(enduro_helpers.fileExists(cmd_folder + '/testproject/cms/index.js')).to.equal(true)
		});

		it("Should delete the project", function(done){
			rimraf(cmd_folder + '/testproject', function(err){
				done()
			})
		});

	});
});