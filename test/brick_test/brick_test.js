// vendor dependencies
const expect = require('chai').expect

// local dependencies
const local_enduro = require('../../index').quick_init()
const test_utilities = require(enduro.enduro_path + '/test/libs/test_utilities')
const brick_handler = require(enduro.enduro_path + '/libs/brick_handler/brick_handler')

describe('brick handler', function () {
	this.timeout(8000);

	before(function () {
		return test_utilities.before(local_enduro, 'brick_testfolder', 'test')
			.then(() => {
				return enduro.actions.render()
			})
	})

	it('should add all brick to configuration', function () {
		expect(enduro.config).to.have.property('bricks')
		expect(enduro.config.bricks.test_brick).to.exist
	})

	after(function () {
		return test_utilities.after()
	})
})

