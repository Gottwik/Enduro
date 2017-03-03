var expect = require('chai').expect

var local_enduro = require('../../index')

describe('Linker', function () {

	it('should link temper, pagelist_generator and flat to the global enduro object', function () {
		expect(enduro.api).to.have.property('temper')
		expect(enduro.api).to.have.property('pagelist_generator')
		expect(enduro.api).to.have.property('flat')
	})

	it('should link temper with the render function', function () {
		expect(enduro.api.temper).to.have.property('render')
	})

})
