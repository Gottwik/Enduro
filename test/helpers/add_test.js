// vendor dependencies
var expect = require("chai").expect

global.__templating_engine = require('handlebars')

describe('Add helper', function() {

	require(ENDURO_FOLDER + "/hbs_helpers/add")

	// no add helper
	it('should parse simple template successfully', function () {
		expect(__templating_engine.compile('<a>aa<a>')()).to.equal('<a>aa<a>')
	})

	// {{add 1 1}}
	it('should add two numbers together', function () {
		expect(__templating_engine.compile('{{add 1 1}}')()).to.equal('2')
	})

	// {{add -1 -1}}
	it('should add two negative numbers together', function () {
		expect(__templating_engine.compile('{{add -1 -1}}')()).to.equal('-2')
	})

	// {{add 0 0}}
	it('should add two zeroes together', function () {
		expect(__templating_engine.compile('{{add 0 0}}')()).to.equal('0')
	})

	// {{add true true}}
	it('should add two booleans', function () {
		expect(__templating_engine.compile('{{add true true}}')()).to.equal('2')
	})

	// {{add "ab" "cd"}}
	it('should add two strings', function () {
		expect(__templating_engine.compile('{{add "ab" "cd"}}')()).to.equal('abcd')
	})

	// {{add }}
	it('should return nothing if no parameters are provided', function () {
		expect(__templating_engine.compile('{{add }}')()).to.equal('')
	})

	// {{add 1 2 3 4 5}}
	it('should add multiple numbers', function () {
		expect(__templating_engine.compile('{{add 1 2 3 4 5}}')()).to.equal('15')
	})

	// {{add 1.5 1.5}}
	it('should add floating decimal numbers', function () {
		expect(__templating_engine.compile('{{add 1.5 1.5}}')()).to.equal('3')
	})

})