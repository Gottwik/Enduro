// vendor dependencies
var expect = require('chai').expect
var path = require('path')
var glob = require('glob')

// local dependencies
var local_enduro = require('../../index').quick_init()
var test_utilities = require(enduro.enduro_path + '/test/libs/test_utilities')
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
var juicebox = require(enduro.enduro_path + '/libs/juicebox/juicebox')

describe('Juicebox pull', function () {

	before(function () {
		return test_utilities.before(local_enduro, 'juicebox_pull_testfolder')
			.then(() => {
				enduro.config.juicebox_enabled = true
			})
	})

	it('should create fresh folder on first pull', function () {
		return juicebox.pull()
			.then(() => {
				var files = glob.sync(path.join(enduro.project_path, 'juicebox', '*'))

				expect(files).to.have.length.of(2)
				expect(files[0]).to.contain('.tar.gz')
				expect(files[1]).to.contain('juicebox/juice.json')
			})
	})


	after(function () {
		return test_utilities.after()
	})
})

