// vendor dependencies
var expect = require('chai').expect

var local_enduro = require('../../index').quick_init()
var helper_handler = require(enduro.enduro_path + '/libs/helper_handler')

describe('Grouped_each helper', function () {

	before(() => {
		return helper_handler.read_helpers()
	})

	it('render empty string if no context is provided', function () {
		expect(enduro.templating_engine.compileSync('{{#grouped_each}}aaa{{/grouped_each}}')()).to.be.empty
	})

	var test_input1 = '{{#grouped_each 3 list}}a{{#each this}}{{this}}{{/each}}{{/grouped_each}}'
	var test_output1 = 'a123a456'
	var test_context1 = {list: [1, 2, 3, 4, 5, 6]}

	it('render every third item', function () {
		enduro.templating_engine.compile(test_input1)(test_context1)
			.then((compiled_output) => {
				expect(compiled_output).to.equal(test_output1)
			})
	})

	var test_input2 = '{{#grouped_each 3 this}}a{{#each this}}{{this}}{{/each}}{{/grouped_each}}'
	var test_output2 = 'a123a456'
	var test_context2 = [1, 2, 3, 4, 5, 6]

	it('render every third item when array is provided', function () {
		enduro.templating_engine.compile(test_input2)(test_context2)
			.then((compiled_output) => {
				expect(compiled_output).to.equal(test_output2)
			})
	})

	var test_input3 = '{{#grouped_each 2 this}}a{{#each this}}{{this}}{{/each}}{{/grouped_each}}'
	var test_output3 = 'a12a34a56'
	var test_context3 = {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6}

	it('render every third item when object is provided', function () {
		enduro.templating_engine.compile(test_input3)(test_context3)
			.then((compiled_output) => {
				expect(compiled_output).to.equal(test_output3)
			})
	})

})
