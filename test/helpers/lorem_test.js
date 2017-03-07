// vendor dependencies
var expect = require('chai').expect

var local_enduro = require('../../index').quick_init()
var helper_handler = require(enduro.enduro_path + '/libs/helper_handler')

describe('Lorem helper', function () {

	before(() => {
		return helper_handler.read_helpers()
	})

	it('Output 10 words on {{lorem}}', function () {
		expect(enduro.templating_engine.compileSync('{{lorem}}')().split(' ').length).to.equal(10)
	})

	it('Output 5 words on {{lorem 5}}', function () {
		expect(enduro.templating_engine.compileSync('{{lorem 5}}')().split(' ').length).to.equal(5)
	})

	it('Output 5 to 10 words on {{lorem 5 10}}', function () {
		expect(enduro.templating_engine.compileSync('{{lorem 5 10}}')().split(' ').length).to.be.within(5, 10)
	})

})
