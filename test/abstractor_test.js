var expect = require('chai').expect

var local_enduro = require('../index').quick_init()
var abstractor = require(enduro.enduro_path + '/libs/abstractor/abstractor')
var test_utilities = require('./libs/test_utilities')

describe('Abstractor', function () {

	before(function () {
		return test_utilities.before(local_enduro, 'abstractor_testfolder')
	})

	it('should register all the abstractors', function () {
		return abstractor.init()
			.then(() => {
				expect(enduro.precomputed_data.abstractors).to.include.keys('empty_init')
			})
	})

	// navigate back to testfolder
	after(function () {
		return test_utilities.after()
	})
})

