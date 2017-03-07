var expect = require('chai').expect

var local_enduro = require('../index').quick_init()
var test_utilities = require(enduro.enduro_path + '/test/libs/test_utilities')

describe('Global data handler', function () {

	before(function () {
		return test_utilities.before(local_enduro, 'global_data_testfolder', 'minimalistic')
			.then(() => {
				return enduro.actions.render()
			})
	})

	it('should read some global data', function () {
		expect(enduro.cms_data).to.include.keys('global')
		expect(enduro.cms_data).to.have.deep.property('global.settings.admin_background_image')
	})

	after(function () {
		return test_utilities.after()
	})
})
