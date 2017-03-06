// vendor dependencies
var expect = require('chai').expect

var local_enduro = require('../../index').quick_init()
var helper_handler = require(enduro.enduro_path + '/libs/helper_handler')

describe('Files helper', function () {

	before(() => {
		return helper_handler.read_helpers()
	})

	it('should list files successfully:', function () {
		expect(enduro.templating_engine.compileSync('{{#files "/../test"}} {{this}} {{/files}}')().split(' ')).to.be.instanceof(Array)
	})

})
