// vendor dependencies
var expect = require('chai').expect

describe('List helper', function () {

	it('list simple 123', function () {
		__templating_engine.compile('{{#list "1" "2" "3"}}{{this}}{{/list}}')()
			.then((compiled_output) => {
				expect(compiled_output).to.equal('123')
			})
	})

})
