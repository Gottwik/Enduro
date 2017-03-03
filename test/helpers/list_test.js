// vendor dependencies
var expect = require('chai').expect

var local_enduro = require('../../index')

describe('List helper', function () {

	it('list simple 123', function () {
		enduro.templating_engine.compile('{{#list "1" "2" "3"}}{{this}}{{/list}}')()
			.then((compiled_output) => {
				expect(compiled_output).to.equal('123')
			})
	})

})
