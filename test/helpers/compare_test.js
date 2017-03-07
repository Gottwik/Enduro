// vendor dependencies
var expect = require('chai').expect

var local_enduro = require('../../index').quick_init()
var helper_handler = require(enduro.enduro_path + '/libs/helper_handler')

describe('Compare helper', function () {

	before(() => {
		return helper_handler.read_helpers()
	})

	// {{compare 1 1 "yes" "no"}}
	it('should compare two numbers successfully', function () {
		expect(enduro.templating_engine.compileSync('{{compare 1 1 "yes" "no"}}')()).to.equal('yes')
	})

	it('should detect different values', function () {
		expect(enduro.templating_engine.compileSync('{{compare 1 2 "yes" "no"}}')()).to.equal('no')
	})

})
