// vendor dependencies
var expect = require('chai').expect

var local_enduro = require('../../index')

describe('Default helper', function () {

	it('should output default value if context variable is not set', function () {
		expect(enduro.templating_engine.compileSync('{{default what "something"}}')()).to.equal('something')
	})

	it('should output variable context variable is provided', function () {
		expect(enduro.templating_engine.compileSync('{{default what "something"}}')({what: 'what'})).to.equal('what')
	})

	it('should output variable if no default is provided and context variable is provided', function () {
		expect(enduro.templating_engine.compileSync('{{default what}}')({what: 'what'})).to.equal('what')
	})

	it('should output nothing if no default is provided', function () {
		expect(enduro.templating_engine.compileSync('{{default what}}')()).to.equal('')
	})

})
