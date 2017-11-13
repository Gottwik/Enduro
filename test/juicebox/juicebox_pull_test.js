// * vendor dependencies
const expect = require('chai').expect
const path = require('path')
const glob = require('glob')

// * enduro dependencies
const local_enduro = require('../../index').quick_init()
const test_utilities = require(enduro.enduro_path + '/test/libs/test_utilities')
const juicebox = require(enduro.enduro_path + '/libs/juicebox/juicebox')

describe('Juicebox pull', function () {

	before(function () {
		this.timeout(8000)
		return test_utilities.before(local_enduro, 'juicebox_pull_testfolder')
			.then(() => {
				enduro.config.juicebox_enabled = true
			})
	})

	it('should create fresh folder on first pull', function () {
		return juicebox.pull()
			.then((hash) => {
				const files = glob.sync(path.join(enduro.project_path, 'juicebox', '*')).map((file) => {
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
				const files = glob.sync(path.join(enduro.project_path, 'juicebox', '*')).map((file) => {
					return file.match(/juicebox_pull_testfolder\/juicebox\/(.*)$/)[1]
				})

				expect(files).to.contain('staging')
				expect(files).to.have.lengthOf(3)
			})
	})

	it('should not create more files if pull is called the third time', function () {
		return juicebox.pull()
			.then(() => {
				const files = glob.sync(path.join(enduro.project_path, 'juicebox', '*')).map((file) => {
					return file.match(/juicebox_pull_testfolder\/juicebox\/(.*)$/)[1]
				})

				expect(files).to.contain('staging')
				expect(files).to.have.lengthOf(3)
			})
	})

	it('should have extracted a cms folder into staging', function () {

		const staging_folder = path.join(enduro.project_path, 'juicebox', 'staging')

		const files = glob.sync(path.join(staging_folder, '**/*'))
		expect(files).to.have.lengthOf.above(5)
	})

	after(function () {
		return test_utilities.after()
	})
})
