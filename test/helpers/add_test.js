// vendor dependencies
var expect = require('chai').expect

var local_enduro = require('../../index').quick_init()
var helper_handler = require(enduro.enduro_path + '/libs/helper_handler')

describe('Add helper', function () {

	before(() => {
		return helper_handler.read_helpers()
	})

	// no add helper
	it('should parse simple template successfully', function () {
		expect(enduro.templating_engine.compileSync('<a>aa<a>')()).to.equal('<a>aa<a>')
	})

	// {{add 1 1}}
	it('should add two numbers together', function () {
		expect(enduro.templating_engine.compileSync('{{add 1 1}}')()).to.equal('2')
	})

	// {{add -1 -1}}
	it('should add two negative numbers together', function () {
		expect(enduro.templating_engine.compileSync('{{add -1 -1}}')()).to.equal('-2')
	})

	// {{add 0 0}}
	it('should add two zeroes together', function () {
		expect(enduro.templating_engine.compileSync('{{add 0 0}}')()).to.equal('0')
	})

	// {{add true true}}
	it('should add two booleans', function () {
		expect(enduro.templating_engine.compileSync('{{add true true}}')()).to.equal('2')
	})

	// {{add "ab" "cd"}}
	it('should add two strings', function () {
		expect(enduro.templating_engine.compileSync('{{add "ab" "cd"}}')()).to.equal('abcd')
	})

	// {{add }}
	it('should return nothing if no parameters are provided', function () {
		expect(enduro.templating_engine.compileSync('{{add }}')()).to.equal('')
	})

	// {{add 1 2 3 4 5}}
	it('should add multiple numbers', function () {
		expect(enduro.templating_engine.compileSync('{{add 1 2 3 4 5}}')()).to.equal('15')
	})

	// {{add 1.5 1.5}}
	it('should add floating decimal numbers', function () {
		expect(enduro.templating_engine.compileSync('{{add 1.5 1.5}}')()).to.equal('3')
	})

})
