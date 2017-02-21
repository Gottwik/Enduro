// vendor dependencies
var expect = require('chai').expect
var enduro = require('../index')
var path = require('path')
var fs = require('fs')

// local dependencies
var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')

describe('Pregeneration', function () {

	// Create a new project
	before(function (done) {
		this.timeout(5000)
		enduro.run(['create', 'testproject_pregeneration'])
			.then(() => {
				// navigate inside new project
				global.CMD_FOLDER = path.join(CMD_FOLDER, 'testproject_pregeneration')
				return enduro.run(['addculture', 'fr', 'es'])

			}, () => {
				done(new Error('Failed to create new project'))
			})
			.then(() => {
				enduro.run(['start'], [])
					.then(() => {
						done()
					})
			})
	})

	it('_settings.css should be pregenerated', function (done) {

		var settings_css_filepath = path.join(CMD_FOLDER, '_src', '_prebuilt', '_settings.css')
		expect(enduro_helpers.file_exists_sync(settings_css_filepath)).to.be.ok

		fs.readFile(settings_css_filepath, 'utf8', function (err, data) {
			if (err) { return logger.err(err) }
			expect(data).to.contain('full-background')
			done()
		})

	})

	it('_cultures.json should be pregenerated', function () {
		var cultures_json_filepath = path.join(CMD_FOLDER, '_src', '_prebuilt', '_cultures.json')
		expect(enduro_helpers.file_exists_sync(cultures_json_filepath)).to.be.ok
	})

	// navigate back to testfolder
	after(function (done) {
		enduro.server_stop(() => {
			global.CMD_FOLDER = process.cwd() + '/testfolder'
			done()
		})
	})

})
