// vendor dependencies
var expect = require('chai').expect
var local_enduro = require('../index')
var path = require('path')
var fs = require('fs')

// local dependencies
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')

describe('Pregeneration', function () {

	// Create a new project
	before(function (done) {
		this.timeout(5000)
		local_enduro.run(['create', 'testproject_pregeneration'])
			.then(() => {
				// navigate inside new project
				enduro.project_path  = path.join(enduro.project_path, 'testproject_pregeneration')
				return local_enduro.run(['addculture', 'fr', 'es'])

			}, () => {
				done(new Error('Failed to create new project'))
			})
			.then(() => {
				local_enduro.run(['start'], [])
					.then(() => {
						done()
					})
			})
	})

	it('_settings.css should be pregenerated', function (done) {

		var settings_css_filepath = path.join(enduro.project_path, '_src', '_prebuilt', '_settings.css')
		expect(flat_helpers.file_exists_sync(settings_css_filepath)).to.be.ok

		fs.readFile(settings_css_filepath, 'utf8', function (err, data) {
			if (err) { return logger.err(err) }
			expect(data).to.contain('full-background')
			done()
		})

	})

	it('_cultures.json should be pregenerated', function () {
		var cultures_json_filepath = path.join(enduro.project_path, '_src', '_prebuilt', '_cultures.json')
		expect(flat_helpers.file_exists_sync(cultures_json_filepath)).to.be.ok
	})

	// navigate back to testfolder
	after(function (done) {
		enduro.actions.stop_server(() => {
			enduro.project_path  = process.cwd() + '/testfolder'
			done()
		})
	})

})
