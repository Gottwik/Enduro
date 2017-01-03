// vendor dependencies
var expect = require('chai').expect

describe('Times helper', function () {

	it('should repeat character inside times helper', function () {
		__templating_engine.compile('{{#times 3}}a{{/times}}')()
			.then((compiled_output) => {
				expect(compiled_output).to.equal('aaa')
			})
	})

	it('should render nothing with 0 repeats provided', function () {
		expect(__templating_engine.compileSync('{{#times 0}}a{{/times}}')()).to.equal('')
	})

	it('should render nothing if content is empty', function () {
		__templating_engine.compile('{{#times 5}}{{/times}}')()
			.then((compiled_output) => {
				expect(compiled_output).to.equal('')
			})
	})

	it('should render random number of repetitions', function () {
		__templating_engine.compile('{{#times 5 10}}a{{/times}}')()
			.then((compiled_output) => {
				expect(compiled_output).to.have.length.within(5, 10)
			})
	})

	it('should be able to nest times helper', function () {
		__templating_engine.compile('{{#times 5}}{{#times 5}}a{{/times}}{{/times}}')()
			.then((compiled_output) => {
				expect(compiled_output).to.have.length.of(25)
			})
	})

})
