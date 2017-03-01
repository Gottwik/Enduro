// vendor dependencies
var expect = require('chai').expect

describe('Multiply helper', function () {

	it('should multiply two numbers', function () {
		expect(enduro.templating_engine.compileSync('{{multiply 2 2}}')()).to.equal('4')
	})

	it('should multiply three numbers', function () {
		expect(enduro.templating_engine.compileSync('{{multiply 2 2 2}}')()).to.equal('8')
	})

	it('should multiply numbers from context', function () {
		expect(enduro.templating_engine.compileSync('{{multiply first second}}')({first: 3, second: 5})).to.equal('15')
	})

})
