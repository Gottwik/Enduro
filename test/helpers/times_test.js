// vendor dependencies
var expect = require('chai').expect

global.__templating_engine = require('handlebars')

describe('Times helper', function () {

	it('should repeat character inside times helper', function () {
		expect(__templating_engine.compile('{{#times 3}}a{{/times}}')()).to.equal('aaa')
	})

	it('should render nothing with 0 repeats provided', function () {
		expect(__templating_engine.compile('{{#times 0}}a{{/times}}')()).to.equal('')
	})

	it('should render nothing if content is empty', function () {
		expect(__templating_engine.compile('{{#times 5}}{{/times}}')()).to.equal('')
	})

	it('should render random number of repetitions', function () {
		expect(__templating_engine.compile('{{#times 5 10}}a{{/times}}')()).to.have.length.within(5, 10)
	})

	it('should be able to nest times helper', function () {
		expect(__templating_engine.compile('{{#times 5}}{{#times 5}}a{{/times}}{{/times}}')()).to.have.length.of(25)
	})

})
