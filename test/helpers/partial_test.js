// vendor dependencies
var expect = require('chai').expect

var local_enduro = require('../../index').quick_init()
var helper_handler = require(enduro.enduro_path + '/libs/helper_handler')

describe('Partial helper', function () {

	before(() => {
		return helper_handler.read_helpers()
	})

	it('Output nothing when no partial name is provided', function () {
		expect(enduro.templating_engine.compileSync('{{partial}}')()).to.equal('')
	})

	it('display simple partial by its name', function () {
		enduro.templating_engine.registerPartial('simple_partial', 'test')

		enduro.templating_engine.compile('{{partial "simple_partial"}}')({})
			.then((compiled_output) => {
				expect(compiled_output).to.equal('test')
			})
	})

	it('display partial with context by its name', function () {
		enduro.templating_engine.registerPartial('simple_partial_2', '{{name}}')

		enduro.templating_engine.compile('{{partial "simple_partial_2"}}')({name: 'martin'})
			.then((compiled_output) => {
				expect(compiled_output).to.equal('martin')
			})
	})

})
