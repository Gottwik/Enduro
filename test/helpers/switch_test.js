// vendor dependencies
var expect = require('chai').expect

describe('Switch helper', function () {

	it('should output default(last) value if no context is provided', function () {
		expect(enduro.templating_engine.compileSync('{{switch small "a"}}')()).to.equal('a')
	})

	it('should output second value if the context matches first condition', function () {
		expect(enduro.templating_engine.compileSync('{{switch small "5px" medium "10px" large "20px"}}')({medium: true})).to.equal('10px')
	})

	it('should output first value if more values match', function () {
		expect(enduro.templating_engine.compileSync('{{switch small "5px" medium "10px"}}')({small: true, medium: true})).to.equal('5px')
	})

})
