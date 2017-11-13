// * vendor dependencies
const expect = require('chai').expect
const Promise = require('bluebird')

// * enduro dependencies
const local_enduro = require('../../index')
const test_utilities = require(enduro.enduro_path + '/test/libs/test_utilities')
const brick_processors = require(enduro.enduro_path + '/libs/bricks/brick_processors')

describe('brick processors', function () {

	this.timeout(12000)
	before(function () {
		return test_utilities.before(local_enduro, 'brick_processors_test')
	})

	it('should add two processor successfully', function () {
		brick_processors.add_processor('test_processor', function (input_data) {
			return new Promise(function (resolve, reject) {
				input_data['new_data'] = 'new_data'
				resolve(input_data)
			})
		})

		brick_processors.add_processor('test_processor', function (input_data) {
			return new Promise(function (resolve, reject) {
				input_data['new_data_2'] = 'new_data_2'
				resolve(input_data)
			})
		})
	})

	const expected_output = {
		a: 2,
		new_data: 'new_data',
		new_data_2: 'new_data_2',
	}

	it('newly added processor should add new data to the input data', function () {
		return brick_processors.process('test_processor', { a: 2 })
			.then((processed_data) => {
				expect(processed_data).to.deep.equal(expected_output)
			})
	})

	it('non-existing processor should return input as was', function () {
		return brick_processors.process('fake_processor', { a: 2 })
			.then((processed_data) => {
				expect(processed_data).to.deep.equal({ a: 2 })
			})
	})
})
