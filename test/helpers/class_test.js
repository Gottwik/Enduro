// vendor dependencies
var expect = require("chai").expect

global.__templating_engine = require('handlebars')

describe('Class helper', function() {

	// {{class true_this}}
	it('should return empty string if zero variables provided', function () {
		expect(__templating_engine.compile('{{class }}')()).to.equal('')
	})

	// {{class true_this}}
	it('should output class name if one class is used', function () {
		expect(__templating_engine.compile('{{class \'true_this\'}}')({true_this: true})).to.equal('true-this')
	})

	// {{class true_this}}
	it('should output empty string if variable is falsy', function () {
		expect(__templating_engine.compile('{{class \'true_this\'}}')({true_this: false})).to.equal('')
	})

	// {{class true_this true_this_also}}
	it('should output empty string if variable is falsy', function () {
		expect(__templating_engine.compile('{{class \'true_this\' \'true_this_also\'}}')({true_this: true, true_this_also: true})).to.equal('true-this true-this-also')
	})

	// {{class true_this true_this_also}}
	it('should output only those classes that are truthy', function () {
		expect(__templating_engine.compile('{{class \'true_this\' \'not_true\' \'true_this_also\'}}')({true_this: true, not_true: false, true_this_also: true})).to.equal('true-this true-this-also')
	})

})