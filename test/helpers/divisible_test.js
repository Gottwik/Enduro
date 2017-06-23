// vendor dependencies
var expect = require('chai').expect

var local_enduro = require('../../index').quick_init()
var helper_handler = require(enduro.enduro_path + '/libs/helper_handler')

describe('Divisible helper', function () {

	before(() => {
		return helper_handler.read_helpers()
	})

	it('should detect 2 being even', function () {
		enduro.templating_engine.compile("{{divisible number 2 'even' 'odd'}}")({ number: 2 })
			.then((compiled_output) => {
				expect(compiled_output).to.equal('even')
			})
	})

	it('should detect 3 being odd', function () {
		enduro.templating_engine.compile("{{divisible number 2 'even' 'odd'}}")({ number: 3 })
			.then((compiled_output) => {
				expect(compiled_output).to.equal('odd')
			})
	})


})
