// vendor dependencies
var Promise = require('bluebird')
var expect = require("chai").expect
var rimraf = require('rimraf')
var fs = require('fs')

// local dependencies
var enduro = require(ENDURO_FOLDER + '/index')
var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')
var page_renderer = require(ENDURO_FOLDER + '/libs/page_rendering/page_renderer')


// Remove logging
// enduro.silent()

describe('page rendering', function() {

	//Create a new project
	before(function(done){
		enduro.run(['create', 'testproject_page_rendering'])
			.then(() => {
				// navigate inside new project
				global.CMD_FOLDER = CMD_FOLDER + '/testproject_page_rendering'
				done()
			}, () => {
				done(new Error("Failed to create new project"))
			})
	});

	it('should render a page based on page name', function () {
		return page_renderer.render_file_by_filename_extend_context('index')
			.then((output) => {
				expect(output).to.contain('head')
				expect(output).to.contain('body')
				expect(output).to.not.contain('{{>end}}')
			})
	})

	it('should render a page based on page name with extended context', function () {
		return page_renderer.render_file_by_filename_extend_context('index', {greeting: 'whatup'})
			.then((output) => {
				expect(output).to.contain('whatup')
			})
	})

	// navigate back to testfolder
	after(function(){
		global.CMD_FOLDER = process.cwd() + '/testfolder'
	})

});