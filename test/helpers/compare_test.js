// vendor dependencies
var expect = require('chai').expect

describe('Compare helper', function () {

	// {{compare 1 1 "yes" "no"}}
	it('should compare two numbers successfully', function () {
		expect(__templating_engine.compileSync('{{compare 1 1 "yes" "no"}}')()).to.equal('yes')
	})

	it('should detect different values', function () {
		expect(__templating_engine.compileSync('{{compare 1 2 "yes" "no"}}')()).to.equal('no')
	})

})
