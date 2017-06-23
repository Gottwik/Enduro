// vendor dependencies
var expect = require('chai').expect

var local_enduro = require('../../index').quick_init()
var helper_handler = require(enduro.enduro_path + '/libs/helper_handler')

describe('Filter helper', function () {

	before(() => {
		return helper_handler.read_helpers()
	})

	it('should filter only people with age of 30', function () {

		const people = [
			{
				name: 'dodo',
				age: 30
			},
			{
				name: 'bibi',
				age: 30
			},
			{
				name: 'tim',
				age: 1
			},
			{
				name: 'samuel',
				age: 4
			}
		]

		enduro.templating_engine.compile("{{#each this}}{{#filter '{ \"age\": 30 }'}}{{this.name}}{{/filter}}{{/each}}")(people)
			.then((compiled_output) => {
				expect(compiled_output).to.equal('dodobibi')
			})
	})

})
