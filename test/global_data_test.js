var expect = require('chai').expect

var local_enduro = require('../index')

describe('Global data handler', function () {

	before(function (done) {
		local_enduro.run(['create', 'global_data_test'])
			.then(() => {
				enduro.project_path = process.cwd() + '/testfolder/global_data_test'
				done()
			}, (err) => {
				done(new Error(err))
			})
	})

	it('should read some global data', function () {
		expect(enduro.cms_data).to.include.keys('global')
		expect(enduro.cms_data).to.have.deep.property('global.settings.admin_background_image')
	})

	// navigate back to testfolder
	after(function () {
		enduro.project_path  = process.cwd() + '/testfolder'
	})
})
