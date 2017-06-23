// vendor dependencies
var expect = require('chai').expect

var local_enduro = require('../../index').quick_init()
var helper_handler = require(enduro.enduro_path + '/libs/helper_handler')

describe('Ternary helper', function () {

	before(() => {
		return helper_handler.read_helpers()
	})

	it('should output first choice if variable is true', function () {
		enduro.templating_engine.compile("{{ternary is_true '1' '2'}}")({ is_true: true })
			.then((compiled_output) => {
				expect(compiled_output).to.equal('1')
			})
	})

	it('should output first choice if variable is set', function () {
		enduro.templating_engine.compile("{{ternary is_true '1' '2'}}")({ is_true: '123' })
			.then((compiled_output) => {
				expect(compiled_output).to.equal('1')
			})
	})

	it('should output second choice if variable is false', function () {
		enduro.templating_engine.compile("{{ternary is_true '1' '2'}}")({ is_true: false })
			.then((compiled_output) => {
				expect(compiled_output).to.equal('2')
			})
	})

	it('should output second choice if variable does not exist', function () {
		enduro.templating_engine.compile("{{ternary is_true '1' '2'}}")()
			.then((compiled_output) => {
				expect(compiled_output).to.equal('2')
			})
	})

	it('should output second choice if variable is numeral zero', function () {
		enduro.templating_engine.compile("{{ternary is_true '1' '2'}}")({ is_true: 0 })
			.then((compiled_output) => {
				expect(compiled_output).to.equal('2')
			})
	})

	it('should output second choice if variable is empty string', function () {
		enduro.templating_engine.compile("{{ternary is_true '1' '2'}}")({ is_true: '' })
			.then((compiled_output) => {
				expect(compiled_output).to.equal('2')
			})
	})

})
