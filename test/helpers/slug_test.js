// vendor dependencies
var expect = require('chai').expect

describe('Slug helper', function () {

	it('should sluggify simple one word', function () {
		expect(__templating_engine.compileSync('{{slug "This"}}')()).to.equal('this')
	})

	it('should sluggify simple two words', function () {
		expect(__templating_engine.compileSync('{{slug "This Link"}}')()).to.equal('this-link')
	})

	it('should sluggify simple two words with multiple whitespaces in between', function () {
		expect(__templating_engine.compileSync('{{slug "This     Link"}}')()).to.equal('this-link')
	})

	it('should remove special characters', function () {
		expect(__templating_engine.compileSync('{{slug "martin.,;\'%@$[]"}}')()).to.equal('martin')
	})

})
