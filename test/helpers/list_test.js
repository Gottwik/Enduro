// vendor dependencies
var expect = require('chai').expect

var local_enduro = require('../../index').quick_init()
var helper_handler = require(enduro.enduro_path + '/libs/helper_handler')

describe('List helper', function () {

	before(() => {
		return helper_handler.read_helpers()
	})

	it('list simple 123', function () {
		enduro.templating_engine.compile('{{#list "1" "2" "3"}}{{this}}{{/list}}')()
			.then((compiled_output) => {
				expect(compiled_output).to.equal('123')
			})
	})

})
