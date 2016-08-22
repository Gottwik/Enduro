var expect = require('chai').expect

var enduro = require(ENDURO_FOLDER + '/index')

describe('Global data handler', function () {

	before(function (done) {
		enduro.run(['create', 'global_data_test'])
			.then(() => {
				CMD_FOLDER = process.cwd() + '/testfolder/global_data_test'
				done()
			}, (err) => {
				done(new Error(err))
			})
	})

	it('should read some global data', function () {
		expect(__data).to.include.keys('global')
		expect(__data).to.have.deep.property('global.settings.admin_background_image')
	})

	// navigate back to testfolder
	after(function () {
		global.CMD_FOLDER = process.cwd() + '/testfolder'
	})
})
