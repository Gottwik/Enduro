// vendor dependencies
var expect = require('chai').expect

var local_enduro = require('../../index')

describe('Slug helper', function () {

	it('should sluggify simple one word', function () {
		expect(enduro.templating_engine.compileSync('{{slug "This"}}')()).to.equal('this')
	})

	it('should sluggify simple two words', function () {
		expect(enduro.templating_engine.compileSync('{{slug "This Link"}}')()).to.equal('this-link')
	})

	it('should sluggify simple two words with multiple whitespaces in between', function () {
		expect(enduro.templating_engine.compileSync('{{slug "This     Link"}}')()).to.equal('this-link')
	})

	it('should remove special characters', function () {
		expect(enduro.templating_engine.compileSync('{{slug "martin.,;\'%@$[]"}}')()).to.equal('martin')
	})

})
