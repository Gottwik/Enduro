
// vendor dependencies
var expect = require('chai').expect
var rewire = require('rewire')

// local dependencies
var local_enduro = require('../index')
var babel = require(global.enduro.enduro_path + '/libs/babel/babel')
var test_utilities = require('./libs/test_utilities')

// rewired dependencies
var internal_babel = rewire(global.enduro.enduro_path + '/libs/babel/babel')

describe('Babel - registering cultures', function () {

	before(function () {
		return test_utilities.before(local_enduro, 'babel_test')
	})

	it('should read the empty cultures correctly', function () {
		var cultures = enduro.config.cultures

		expect(cultures).to.exist
		expect(cultures).to.be.a('array')
		expect(cultures).not.to.be.empty
		expect(cultures[0]).to.equal('')
	})

	it('should add cultures correctly', function () {
		babel.add_culture(['en', 'de'])

		var cultures = enduro.config.cultures

		expect(cultures).to.exist
		expect(cultures).to.be.a('array')
		expect(cultures).not.to.be.empty
		expect(cultures).to.include('en')
		expect(cultures).to.include('de')
	})

	after(function () {
		return test_utilities.after()
	})
})

describe('Babel - culturalizing cms files', function () {

	var test_context = {
		greeting: 'you',
		$greeting_de: 'du!',
		superlative: 'asd'
	}

	var expected_terminated_context = {
		greeting: 'you',
		superlative: 'asd'
	}

	var expected_culturalized_context_de = {
		greeting: 'du!',
		superlative: 'asd'
	}

	it('should terminate context correctly', function (done) {
		expect(JSON.stringify(internal_babel.__get__('terminate')(test_context))).to.equal(JSON.stringify(expected_terminated_context))
		done()
	})

	it('should culturalize object currectly', function (done) {
		expect(JSON.stringify(babel.culturalize(test_context, 'de'))).to.equal(JSON.stringify(expected_culturalized_context_de))
		done()
	})

	it('should culturalize object currectly with non-present cultural key', function (done) {
		expect(JSON.stringify(babel.culturalize(test_context, 'en'))).to.equal(JSON.stringify(expected_terminated_context))
		done()
	})

})
