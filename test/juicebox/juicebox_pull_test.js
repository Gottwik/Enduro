// vendor dependencies
var expect = require('chai').expect
var path = require('path')
var glob = require('glob')

// local dependencies
var local_enduro = require('../../index').quick_init()
var test_utilities = require(enduro.enduro_path + '/test/libs/test_utilities')
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
			.then((hash) => {
				var files = glob.sync(path.join(enduro.project_path, 'juicebox', '*')).map((file) => {
					return file.match(/juicebox_pull_testfolder\/juicebox\/(.*)$/)[1]
				})

				expect(files).to.have.length.above(1)
				expect(files).to.contain(hash + '.tar.gz')
				expect(files).to.contain('juice.json')
			})
	})

	it('should not create more files if pull is called again, but should create staging folder', function () {
		return juicebox.pull()
			.then(() => {
				var files = glob.sync(path.join(enduro.project_path, 'juicebox', '*')).map((file) => {
					return file.match(/juicebox_pull_testfolder\/juicebox\/(.*)$/)[1]
				})

				expect(files).to.contain('staging')
				expect(files).to.have.length.of(3)
			})
	})

	it('should not create more files if pull is called the third time', function () {
		return juicebox.pull()
			.then(() => {
				var files = glob.sync(path.join(enduro.project_path, 'juicebox', '*')).map((file) => {
					return file.match(/juicebox_pull_testfolder\/juicebox\/(.*)$/)[1]
				})

				expect(files).to.contain('staging')
				expect(files).to.have.length.of(3)
			})
	})

	it('should have extracted a cms folder into staging', function () {

		var staging_folder = path.join(enduro.project_path, 'juicebox', 'staging')

		var files = glob.sync(path.join(staging_folder, '**/*'))
		expect(files).to.have.length.to.be.above(5)
	})

	after(function () {
		return test_utilities.after()
	})
})

