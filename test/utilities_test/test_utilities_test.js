// vendor dependencies
var expect = require('chai').expect
var path = require('path')

// local dependencies
var local_enduro = require('../../index').quick_init()
var test_utilities = require(enduro.enduro_path + '/test/libs/test_utilities')

describe('Test utilites', function () {
	this.timeout(7000)
	before(function () {
		return test_utilities.before(local_enduro, 'utilities test')
			.then(() => {
				return enduro.actions.start()
			})
	})

	it('should get session id', function () {
		return test_utilities.get_sid()
			.then((sid) => {
				expect(sid).to.not.be.empty
			})
	})

	after(function () {
		return enduro.actions.stop_server()
			.then(() => {
				return test_utilities.after()
			})
	})

})
