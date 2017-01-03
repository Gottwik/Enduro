// vendor dependencies
var expect = require('chai').expect

describe('Partial helper', function () {

	it('Output nothing when no partial name is provided', function () {
		expect(__templating_engine.compileSync('{{partial}}')()).to.equal('')
	})

	it('display simple partial by its name', function () {
		__templating_engine.registerPartial('simple_partial', 'test')

		__templating_engine.compile('{{partial "simple_partial"}}')({})
			.then((compiled_output) => {
				expect(compiled_output).to.equal('test')
			})
	})

	it('display partial with context by its name', function () {
		__templating_engine.registerPartial('simple_partial_2', '{{name}}')

		__templating_engine.compile('{{partial "simple_partial_2"}}')({name: 'martin'})
			.then((compiled_output) => {
				expect(compiled_output).to.equal('martin')
			})
	})

})
