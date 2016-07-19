// vendor dependencies
var expect = require("chai").expect
var enduro = require('../index')
var request = require('request')
var path = require('path')
var fs = require('fs')

// local dependencies
var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')

describe('Pregeneration', function() {

	//Create a new project
	before(function(done){
		enduro.run(['create', 'testproject_pregeneration'])
			.then(() => {
				// navigate inside new project
				global.CMD_FOLDER = CMD_FOLDER + '/testproject_pregeneration'
				enduro.run(['start'], [])
					.then(() => {
						done()
					})
			}, () => {
				done(new Error("Failed to create new project"))
			})
	})

	it("_settings.css should be pregenerated", function(done){

		var settings_css_filepath = path.join(CMD_FOLDER, '_src', '_prebuilt', '_settings.css')
		expect(enduro_helpers.fileExists(settings_css_filepath)).to.be.ok

		fs.readFile(settings_css_filepath, 'utf8', function(err, data) {
			if(err) { return kiska_logger.err(err) }
			expect(data).to.contain('full-background')
			done()
		})

	})

	// navigate back to testfolder
	after(function(done){
		enduro.server_stop(() => {
			global.CMD_FOLDER = process.cwd() + '/testfolder'
			done()
		})
	})

})