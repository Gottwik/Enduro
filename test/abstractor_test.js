// vendor dependencies
var expect = require('chai').expect

// local dependencies
var local_enduro = require('../index').quick_init()
var abstractor = require(enduro.enduro_path + '/libs/abstractor/abstractor')
var test_utilities = require('./libs/test_utilities')

describe('Abstractor', function () {
	this.timeout(7000) // this is currently the first test of all and sometimes the initial enduro config read is slower than the default 2000ms

	before(function () {
		return test_utilities.before(local_enduro, 'abstractor_testfolder')
	})

	it('should register all the abstractors', function () {
		return abstractor.init()
			.then(() => {
				expect(enduro.precomputed_data.abstractors).to.include.keys('empty_init')
			})
	})

	after(function () {
		return test_utilities.after()
	})
})

