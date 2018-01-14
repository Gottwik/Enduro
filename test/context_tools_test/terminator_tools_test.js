// * vendor dependencies
const expect = require('chai').expect

// * enduro dependencies
const terminator_tools = require(enduro.enduro_path + '/libs/context_tools/terminator_tools')

describe('terminator tools - get terminator', function () {

	it('should return false if terminator does not exist', function () {
		expect(terminator_tools.get_terminator('something')).to.be.false
	})

	it('should return false if terminator is missing', function () {
		expect(terminator_tools.get_terminator('$something')).to.be.false
	})

	it('should get terminator if it exists', function () {
		expect(terminator_tools.get_terminator('$something_type')).to.equal('type')
	})

	it('should get terminator with underscore in it', function () {
		expect(terminator_tools.get_terminator('$something_type_type')).to.equal('type_type')
	})
})

describe('terminator tools - replace terminator', function () {

	it('should replace terminator', function () {
		expect(terminator_tools.replace_terminator('$abc_something', 'type')).to.equal('$abc_type')
	})

	it('should replace terminator when original had underscore in it', function () {
		expect(terminator_tools.replace_terminator('$abc_something_else`', 'type')).to.equal('$abc_type')
	})

	it('should replace terminator when replacement has underscore', function () {
		expect(terminator_tools.replace_terminator('$abc_something', 'another_type')).to.equal('$abc_another_type')
	})

})
